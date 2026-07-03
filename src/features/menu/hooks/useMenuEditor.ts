import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { MenuModalMode } from '@/features/menu/components/MenuValidationModal';

import { checkMinimalDiff } from '@/features/menu/helpers/menuComparators';
import {
  areDishCollectionsEqual,
  sortDishesWithOrderNumbers,
} from '@/features/menu/helpers/menuDishHelpers';
import { mapCloudPayloadToMenuState } from '@/features/menu/helpers/menuMappers';

import { useMenuDatasetQuery } from '@/features/menu/hooks/useMenuDatasetQuery';
import { useMenuSyncMutation } from '@/features/menu/hooks/useMenuSyncMutation';
import { useMenuSyncStatus } from '@/features/menu/hooks/useMenuSyncStatus';
import { useUndoableState } from '@/features/menu/hooks/useUndoableState';

import type { ActiveEditCell, EditableDishField } from '@/features/menu/types/menuEditor.types';
import type { DishItem, MenuPage } from '@/features/menu/types/sync.types';

import {
  validateEmptyPages,
  validateDishFields,
  type InvalidDishDetail,
} from '@/features/menu/utils/menuValidators';

export function useMenuEditor() {
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [localPageFilesMap, setLocalPageFilesMap] = useState<Record<string, File>>({});
  const [activeEditCell, setActiveEditCell] = useState<ActiveEditCell | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<MenuModalMode>(null);
  const [emptyPagesData, setEmptyPagesData] = useState<number[]>([]);
  const [invalidDishesData, setInvalidDishesData] = useState<InvalidDishDetail[]>([]);

  const addPagesInputRef = useRef<HTMLInputElement>(null);
  const replacePageInputRef = useRef<HTMLInputElement>(null);
  const dragHistoryBaseRef = useRef<DishItem[] | null>(null);
  const hasHydratedRef = useRef(false);

  const {
    value: dishes,
    setValue: setDishes,
    undo: undoDishAction,
    redo: redoDishAction,
    canUndo,
    canRedo,
  } = useUndoableState<DishItem[]>([], { isEqual: areDishCollectionsEqual });

  const { data: dbSnapshot, isLoading, isError } = useMenuDatasetQuery();
  const syncMutation = useMenuSyncMutation();

  const activePageObject = menuPages[activePageIndex];

  const syncStatus = useMenuSyncStatus({
    draftPages: menuPages,
    draftDishes: dishes,
    dbSnapshot,
    isLoading,
    isError,
    isSyncPending: syncMutation.isPending,
  });

  const computedDishesDataset = useMemo(
    () => sortDishesWithOrderNumbers(dishes, menuPages),
    [dishes, menuPages],
  );

  useEffect(() => {
    if (!dbSnapshot || hasHydratedRef.current) return;

    hasHydratedRef.current = true;

    const { pages, dishes: initialDishes } = mapCloudPayloadToMenuState(dbSnapshot);

    console.log('Mapped dishes', initialDishes);
    console.log('Mapped pages', pages);

    setMenuPages(pages);
    setDishes(initialDishes);
    setActivePageIndex(0);
    setLocalPageFilesMap({});
  }, [dbSnapshot, setDishes]);

  const applySyncedPageUrls = useCallback((updatedPages: MenuPage[]) => {
    console.log('🟢 Cloud sync confirmed. Updating working UI states with public S3 URLs...');
    setMenuPages(updatedPages);
    setLocalPageFilesMap({});
  }, []);

  const synchronizeDatasetChanges = useCallback(() => {
    if (!dbSnapshot) return;
    if (!checkMinimalDiff(menuPages, dishes, dbSnapshot)) return;

    syncMutation.mutate(
      {
        currentPages: menuPages,
        currentDishes: dishes,
        localPageFilesMap,
        dbSnapshot,
      },
      {
        onSuccess: ({ finalSnapshotPages }) => {
          applySyncedPageUrls(finalSnapshotPages);
        },
      },
    );
  }, [dbSnapshot, menuPages, dishes, localPageFilesMap, syncMutation, applySyncedPageUrls]);

  const handleUndoDishAction = useCallback(() => {
    undoDishAction();
    setActiveEditCell(null);
  }, [undoDishAction]);

  const handleRedoDishAction = useCallback(() => {
    redoDishAction();
    setActiveEditCell(null);
  }, [redoDishAction]);

  useEffect(() => {
    const handleKeyboardHistoryCommand = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!event.ctrlKey) return;

      if (key === 'z') {
        event.preventDefault();
        handleUndoDishAction();
      }

      if (key === 'y') {
        event.preventDefault();
        handleRedoDishAction();
      }
    };

    window.addEventListener('keydown', handleKeyboardHistoryCommand);
    return () => window.removeEventListener('keydown', handleKeyboardHistoryCommand);
  }, [handleRedoDishAction, handleUndoDishAction]);

  const handlePageNext = useCallback(() => {
    setActivePageIndex((prev) => (prev < menuPages.length - 1 ? prev + 1 : prev));
  }, [menuPages.length]);

  const handlePagePrevious = useCallback(() => {
    setActivePageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleOpenAddPages = useCallback(() => {
    addPagesInputRef.current?.click();
  }, []);

  const handleOpenReplacePage = useCallback(() => {
    if (menuPages.length === 0) return;
    replacePageInputRef.current?.click();
  }, [menuPages.length]);

  const handleUploadedLocalFilesPipeline = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (!files || files.length === 0) return;

      const newFileEntries: Record<string, File> = {};
      const existingPageCount = menuPages.length;

      const transformedNewPages: MenuPage[] = Array.from(files).map((file, index) => {
        const pageId = crypto.randomUUID();
        const imageUrl = URL.createObjectURL(file);
        const pageNumber = existingPageCount + index + 1;

        console.log('🔎  imageUrl is\n', imageUrl);
        console.log('🔎  pageId is\n', pageId);

        newFileEntries[pageId] = file;

        return { pageId, imageUrl, pageNumber };
      });

      if (transformedNewPages.length === 0) return;

      setMenuPages((prev) => [...prev, ...transformedNewPages]);
      setLocalPageFilesMap((prev) => ({ ...prev, ...newFileEntries }));
      setActivePageIndex(existingPageCount);
      setActiveEditCell(null);
      dragHistoryBaseRef.current = null;
      event.target.value = '';
    },
    [menuPages.length],
  );

  const handleRemoveCurrentPage = useCallback(() => {
    if (menuPages.length === 0) return;

    const pageToDestroy = menuPages[activePageIndex];
    const pageIdToDestroy = pageToDestroy.pageId;

    setDishes((prevDishes) => prevDishes.filter((dish) => dish.pageId !== pageIdToDestroy));

    setLocalPageFilesMap((prevMap) => {
      const updatedMap = { ...prevMap };
      delete updatedMap[pageIdToDestroy];
      return updatedMap;
    });

    setMenuPages((prevPages) => {
      const filtered = prevPages.filter((page) => page.pageId !== pageIdToDestroy);
      return filtered.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      }));
    });

    setActivePageIndex((prevIndex) => {
      if (prevIndex === 0) return 0;
      if (prevIndex >= menuPages.length - 1) return menuPages.length - 2;
      return prevIndex;
    });

    setActiveEditCell(null);
  }, [menuPages, activePageIndex, setDishes]);

  const handleReplaceCurrentPageImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (!files || files.length === 0) return;

      const targetFile = files[0];
      const targetPage = menuPages[activePageIndex];
      if (!targetPage) return;

      const targetPageId = targetPage.pageId;
      const newLocalUrl = URL.createObjectURL(targetFile);

      setLocalPageFilesMap((prevMap) => ({
        ...prevMap,
        [targetPageId]: targetFile,
      }));

      setMenuPages((prevPages) =>
        prevPages.map((page) =>
          page.pageId === targetPageId ? { ...page, imageUrl: newLocalUrl } : page,
        ),
      );

      event.target.value = '';
    },
    [menuPages, activePageIndex],
  );

  const handleTriggerSyncValidationFlow = useCallback(() => {
    const dishCheck = validateDishFields(menuPages, dishes);
    if (!dishCheck.isValid) {
      setInvalidDishesData(dishCheck.invalidDishes);
      setModalMode('INVALID_DISHES');
      setModalOpen(true);
      return;
    }

    const pageCheck = validateEmptyPages(menuPages, dishes);
    if (!pageCheck.isValid) {
      setEmptyPagesData(pageCheck.emptyPageNumbers);
      setModalMode('EMPTY_PAGES');
      setModalOpen(true);
      return;
    }

    setModalMode('CONFIRM_SYNC');
    setModalOpen(true);
  }, [menuPages, dishes]);

  const handleExecuteConfirmedAction = useCallback(() => {
    setModalOpen(false);

    switch (modalMode) {
      case 'CONFIRM_DELETE':
        handleRemoveCurrentPage();
        break;
      case 'CONFIRM_SYNC':
      case 'EMPTY_PAGES':
        synchronizeDatasetChanges();
        break;
      default:
        break;
    }
  }, [modalMode, handleRemoveCurrentPage, synchronizeDatasetChanges]);

  const handleTriggerDeleteConfirmation = useCallback(() => {
    if (menuPages.length === 0) return;
    setModalMode('CONFIRM_DELETE');
    setModalOpen(true);
  }, [menuPages.length]);

  const handleAddNewCoordinatePin = useCallback(
    (
      coords: Omit<
        DishItem,
        'id' | 'pageId' | 'name' | 'cost' | 'prepTime' | 'createdAt' | 'imageUrl'
      >,
    ) => {
      if (!activePageObject) return;

      const newId = crypto.randomUUID();
      const newDishRecord: DishItem = {
        ...coords,
        id: newId,
        pageId: activePageObject.pageId,
        imageUrl: '',
        name: '',
        cost: '',
        prepTime: '',
        createdAt: Date.now(),
      };

      setDishes((prev) => [...prev, newDishRecord]);
      setActiveEditCell({ id: newId, field: 'name' });
    },
    [activePageObject, setDishes],
  );

  const handleDeleteCoordinateRecord = useCallback(
    (id: string) => {
      setDishes((prev) => prev.filter((dish) => dish.id !== id));
      setActiveEditCell((current) => (current?.id === id ? null : current));
    },
    [setDishes],
  );

  const handleStartCoordinateDrag = useCallback(() => {
    dragHistoryBaseRef.current = dishes;
  }, [dishes]);

  const handleUpdateCoordinatePosition = useCallback(
    (id: string, xPercent: number, yPercent: number) => {
      setDishes(
        (prev) =>
          prev.map((dish) =>
            dish.id === id
              ? { ...dish, coordinateXInMenu: xPercent, coordinateYInMenu: yPercent }
              : dish,
          ),
        { record: false },
      );
    },
    [setDishes],
  );

  const handleCommitCoordinateDrag = useCallback(() => {
    if (!dragHistoryBaseRef.current) return;

    setDishes((current) => current, { historyBase: dragHistoryBaseRef.current });
    dragHistoryBaseRef.current = null;
  }, [setDishes]);

  const handleUpdateDishDataField = useCallback(
    (id: string, field: EditableDishField, value: string) => {
      setDishes((prev) =>
        prev.map((dish) => (dish.id === id ? { ...dish, [field]: value } : dish)),
      );
    },
    [setDishes],
  );

  const handleSyncCanvasToRowPage = useCallback(
    (targetPageId: string) => {
      const targetIdx = menuPages.findIndex((page) => page.pageId === targetPageId);
      if (targetIdx !== -1) setActivePageIndex(targetIdx);
    },
    [menuPages],
  );

  const handleRequestRowFocus = useCallback((id: string) => {
    setActiveEditCell({ id, field: 'name' });
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return {
    menuPages,
    activePageIndex,
    activePageObject,
    computedDishesDataset,
    activeEditCell,
    setActiveEditCell,
    syncStatus,
    canUndo,
    canRedo,
    addPagesInputRef,
    replacePageInputRef,
    modal: {
      isOpen: modalOpen,
      mode: modalMode,
      emptyPageNumbers: emptyPagesData,
      invalidDishes: invalidDishesData,
      activePageNumber: menuPages[activePageIndex]?.pageNumber,
      close: closeModal,
      onProceed: handleExecuteConfirmedAction,
    },
    handlers: {
      undo: handleUndoDishAction,
      redo: handleRedoDishAction,
      pageNext: handlePageNext,
      pagePrevious: handlePagePrevious,
      openAddPages: handleOpenAddPages,
      openReplacePage: handleOpenReplacePage,
      uploadLocalFiles: handleUploadedLocalFilesPipeline,
      replaceCurrentPageImage: handleReplaceCurrentPageImage,
      triggerDeleteConfirmation: handleTriggerDeleteConfirmation,
      triggerSyncValidation: handleTriggerSyncValidationFlow,
      addCoordinatePin: handleAddNewCoordinatePin,
      deleteCoordinateRecord: handleDeleteCoordinateRecord,
      startCoordinateDrag: handleStartCoordinateDrag,
      updateCoordinatePosition: handleUpdateCoordinatePosition,
      commitCoordinateDrag: handleCommitCoordinateDrag,
      updateDishDataField: handleUpdateDishDataField,
      syncCanvasToRowPage: handleSyncCanvasToRowPage,
      requestRowFocus: handleRequestRowFocus,
    },
  };
}
