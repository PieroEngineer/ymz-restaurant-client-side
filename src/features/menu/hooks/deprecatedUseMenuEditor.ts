// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';


// import { checkMinimalDiff } from '@/features/menu/helpers/menuComparators';
// import {areDishCollectionsEqual, sortDishesWithOrderNumbers} from '@/features/menu/helpers/menuDishHelpers';

// import { deprecateUseMenuDatasetQuery } from '@/features/menu/hooks/useMenuDatasetQuery';
// import { useMenuSyncStatus } from '@/features/menu/hooks/useMenuSyncStatus';
// import { useUndoableState } from '@/features/menu/hooks/useUndoableState';

// import type { deprecateDish, MenuPage } from '@/features/menu/types/domain.types';

// import {
//   validateEmptyPages,
//   validateDishFields,
//   type InvalidDishDetail,
// } from '@/features/menu/helpers/menuValidators';

// /**
//  * @deprecated This functions was refactorized and modularized in other file. 
//  * This function only is useful to understand how it was working earlier. 
//  * Once stability is achieved, delete this function
//  */
// export function deprecatedUseMenuEditor() { // TODO: break it in different hooks
//   // ===== UI State =====
//   // Menu pages and navigation
//   const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
//   const [activePageIndex, setActivePageIndex] = useState(0);
//   const [localPageFilesMap, setLocalPageFilesMap] = useState<Record<string, File>>({});
//   const [activeEditCell, setActiveEditCell] = useState<ActiveEditCell | null>(null);

//   // Modal management
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<MenuModalMode>(null);
//   const [emptyPagesData, setEmptyPagesData] = useState<number[]>([]);
//   const [invalidDishesData, setInvalidDishesData] = useState<InvalidDishDetail[]>([]);

//   // ===== Refs =====
//   // File input references for page upload/replace
//   const addPagesInputRef = useRef<HTMLInputElement>(null);
//   const replacePageInputRef = useRef<HTMLInputElement>(null);
//   // Tracks base state for drag operations to enable undo/redo
//   const dragHistoryBaseRef = useRef<deprecateDish[] | null>(null);
//   // Prevents duplicate hydration from cloud data
//   const hasHydratedRef = useRef(false);

//   // ===== Dish State with Undo/Redo Support =====
//   const {
//     value: dishes,
//     setValue: setDishes,
//     reset: resetDishes,
//     undo: undoDishAction,
//     redo: redoDishAction,
//     canUndo,
//     canRedo,
//   } = useUndoableState<deprecateDish[]>([], { isEqual: areDishCollectionsEqual });

//   // ===== Data Fetching & Mutations =====
//   const { data: dbSnapshot, isLoading, isError } = deprecateUseMenuDatasetQuery();
//   const syncMutation = useMenuSyncMutation();

//   // ===== Derived State =====
//   // Currently selected page object
//   const activePageObject = menuPages[activePageIndex];

//   // Compute sync status based on current draft and database state
//   const syncStatus = useMenuSyncStatus({
//     draftPages: menuPages,
//     draftDishes: dishes,
//     dbSnapshot,
//     isLoading,
//     isError,
//     isSyncPending: syncMutation.isPending,
//   });

//   // Memoized sorted dishes for display
//   const computedDishesDataset = useMemo(
//     () => sortDishesWithOrderNumbers(dishes, menuPages),
//     [dishes, menuPages],
//   );

//   // ===== Effects =====
//   // Hydrate editor state from cloud snapshot on first load
//   useEffect(() => {
//     if (!dbSnapshot || hasHydratedRef.current) return;

//     hasHydratedRef.current = true;

//     const { pages, dishes: initialDishes } = mapCloudPayloadToMenuState(dbSnapshot);

//     console.log('Mapped dishes', initialDishes);
//     console.log('Mapped pages', pages);

//     setMenuPages(pages);
//     resetDishes(initialDishes);
//     setActivePageIndex(0);
//     setLocalPageFilesMap({});
//   }, [dbSnapshot, resetDishes]);

//   // ===== Sync Handlers =====
//   // Update UI with confirmed synced URLs from cloud
//   const applySyncedPageUrls = useCallback((updatedPages: MenuPage[]) => {
//     console.log('🟢 Cloud sync confirmed. Updating working UI states with public S3 URLs...');
//     setMenuPages(updatedPages);
//     setLocalPageFilesMap({});
//   }, []);

//   // Initiate cloud sync if changes exist
//   const synchronizeDatasetChanges = useCallback(() => {
//     if (!dbSnapshot) return;
//     if (!checkMinimalDiff(menuPages, dishes, dbSnapshot)) return;

//     syncMutation.mutate(
//       {
//         currentPages: menuPages,
//         currentDishes: dishes,
//         localPageFilesMap,
//         dbSnapshot,
//       },
//       {
//         onSuccess: ({ finalSnapshotPages }) => {
//           applySyncedPageUrls(finalSnapshotPages);
//         },
//       },
//     );
//   }, [dbSnapshot, menuPages, dishes, localPageFilesMap, syncMutation, applySyncedPageUrls]);

//   // ===== Undo/Redo Handlers =====
//   const handleUndoDishAction = useCallback(() => {
//     undoDishAction();
//     setActiveEditCell(null);
//   }, [undoDishAction]);

//   const handleRedoDishAction = useCallback(() => {
//     redoDishAction();
//     setActiveEditCell(null);
//   }, [redoDishAction]);

//   // Listen for keyboard undo/redo shortcuts (Ctrl+Z / Ctrl+Y)
//   useEffect(() => {
//     const handleKeyboardHistoryCommand = (event: KeyboardEvent) => {
//       const key = event.key.toLowerCase();
//       if (!event.ctrlKey) return;

//       if (key === 'z') {
//         event.preventDefault();
//         handleUndoDishAction();
//       }

//       if (key === 'y') {
//         event.preventDefault();
//         handleRedoDishAction();
//       }
//     };

//     window.addEventListener('keydown', handleKeyboardHistoryCommand);
//     return () => window.removeEventListener('keydown', handleKeyboardHistoryCommand);
//   }, [handleRedoDishAction, handleUndoDishAction]);

//   // ===== Page Navigation Handlers =====
//   const handlePagePrevious = useCallback(() => {
//     setActivePageIndex((prev) => (prev > 0 ? prev - 1 : prev));
//   }, []);
  
//   const handlePageNext = useCallback(() => {
//     setActivePageIndex((prev) => (prev < menuPages.length - 1 ? prev + 1 : prev));
//   }, [menuPages.length]);

//   // ===== File Input Handlers =====
//   const handleOpenAddPages = useCallback(() => {
//     addPagesInputRef.current?.click();
//   }, []);

//   const handleOpenReplacePage = useCallback(() => {
//     if (menuPages.length === 0) return;
//     replacePageInputRef.current?.click();
//   }, [menuPages.length]);

//   // Process uploaded page files and add to menu
//   const handleUploadedLocalFilesPipeline = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const { files } = event.target;
//       if (!files || files.length === 0) return;

//       const newFileEntries: Record<string, File> = {};
//       const existingPageCount = menuPages.length;

//       // Create page objects with blob URLs for preview
//       const transformedNewPages: MenuPage[] = Array.from(files).map((file, index) => {
//         const pageId = crypto.randomUUID();
//         const imageUrl = URL.createObjectURL(file);
//         const pageNumber = existingPageCount + index + 1;

//         console.log('🔎  imageUrl is\n', imageUrl);
//         console.log('🔎  pageId is\n', pageId);

//         newFileEntries[pageId] = file;

//         return { pageId, imageUrl, pageNumber };
//       });

//       if (transformedNewPages.length === 0) return;

//       setMenuPages((prev) => [...prev, ...transformedNewPages]);
//       setLocalPageFilesMap((prev) => ({ ...prev, ...newFileEntries }));
//       setActivePageIndex(existingPageCount);
//       setActiveEditCell(null);
//       dragHistoryBaseRef.current = null;
//       event.target.value = '';
//     },
//     [menuPages.length],
//   );

//   // ===== Page Management Handlers =====
//   // Remove current page and associated dishes, update page numbers
//   const handleRemoveCurrentPage = useCallback(() => {
//     if (menuPages.length === 0) return;

//     const pageToDestroy = menuPages[activePageIndex];
//     const pageIdToDestroy = pageToDestroy.pageId;

//     setDishes((prevDishes) => prevDishes.filter((dish) => dish.pageId !== pageIdToDestroy));

//     setLocalPageFilesMap((prevMap) => {
//       const updatedMap = { ...prevMap };
//       delete updatedMap[pageIdToDestroy];
//       return updatedMap;
//     });

//     setMenuPages((prevPages) => {
//       const filtered = prevPages.filter((page) => page.pageId !== pageIdToDestroy);
//       return filtered.map((page, index) => ({
//         ...page,
//         pageNumber: index + 1,
//       }));
//     });

//     setActivePageIndex((prevIndex) => {
//       if (prevIndex === 0) return 0;
//       if (prevIndex >= menuPages.length - 1) return menuPages.length - 2;
//       return prevIndex;
//     });

//     setActiveEditCell(null);
//   }, [menuPages, activePageIndex, setDishes]);

//   // Replace current page image with new file
//   const handleReplaceCurrentPageImage = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const { files } = event.target;
//       if (!files || files.length === 0) return;

//       const targetFile = files[0];
//       const targetPage = menuPages[activePageIndex];
//       if (!targetPage) return;

//       const targetPageId = targetPage.pageId;
//       const newLocalUrl = URL.createObjectURL(targetFile);

//       setLocalPageFilesMap((prevMap) => ({
//         ...prevMap,
//         [targetPageId]: targetFile,
//       }));

//       setMenuPages((prevPages) =>
//         prevPages.map((page) =>
//           page.pageId === targetPageId ? { ...page, imageUrl: newLocalUrl } : page,
//         ),
//       );

//       event.target.value = '';
//     },
//     [menuPages, activePageIndex],
//   );

//   // ===== Validation & Modal Handlers =====
//   // Validate dishes and pages before sync, show appropriate modal
//   const handleTriggerSyncValidationFlow = useCallback(() => {
//     const dishCheck = validateDishFields(menuPages, dishes);
//     if (!dishCheck.isValid) {
//       setInvalidDishesData(dishCheck.invalidDishes);
//       setModalMode('INVALID_DISHES');
//       setModalOpen(true);
//       return;
//     }

//     const pageCheck = validateEmptyPages(menuPages, dishes);
//     if (!pageCheck.isValid) {
//       setEmptyPagesData(pageCheck.emptyPageNumbers);
//       setModalMode('EMPTY_PAGES');
//       setModalOpen(true);
//       return;
//     }

//     setModalMode('CONFIRM_SYNC');
//     setModalOpen(true);
//   }, [menuPages, dishes]);

//   // Execute action based on modal mode
//   const handleExecuteConfirmedAction = useCallback(() => {
//     setModalOpen(false);

//     switch (modalMode) {
//       case 'CONFIRM_DELETE':
//         handleRemoveCurrentPage();
//         break;
//       case 'CONFIRM_SYNC':
//       case 'EMPTY_PAGES':
//         synchronizeDatasetChanges();
//         break;
//       default:
//         break;
//     }
//   }, [modalMode, handleRemoveCurrentPage, synchronizeDatasetChanges]);

//   const handleTriggerDeleteConfirmation = useCallback(() => {
//     if (menuPages.length === 0) return;
//     setModalMode('CONFIRM_DELETE');
//     setModalOpen(true);
//   }, [menuPages.length]);

//   // ===== Coordinate Pin & Dish Handlers =====
//   // Add new dish pin at coordinates on active page
//   const handleAddNewCoordinatePin = useCallback(
//     (
//       coords: Omit<
//         deprecateDish,
//         'id' | 'pageId' | 'name' | 'cost' | 'prepTime' | 'createdAt' | 'imageUrl'
//       >,
//     ) => {
//       if (!activePageObject) return;

//       const newId = crypto.randomUUID();
//       const newDishRecord: deprecateDish = {
//         ...coords,
//         id: newId,
//         pageId: activePageObject.pageId,
//         imageUrl: '',
//         name: '',
//         cost: '',
//         prepTime: '',
//         createdAt: Date.now(),
//       };

//       setDishes((prev) => [...prev, newDishRecord]);
//       setActiveEditCell({ id: newId, field: 'name' });
//     },
//     [activePageObject, setDishes],
//   );

  
//   // Remove dish by id
//   const handleDeleteCoordinateRecord = useCallback(
//     (id: string) => {
//       setDishes((prev) => prev.filter((dish) => dish.id !== id));
//       setActiveEditCell((current) => (current?.id === id ? null : current));
//     },
//     [setDishes],
//   );

//   // ===== Coordinate Drag Handlers =====
//   // Record initial state before drag starts
//   const handleStartCoordinateDrag = useCallback(() => {
//     dragHistoryBaseRef.current = dishes;
//   }, [dishes]);

//   // Update dish coordinates during drag (without recording history)
//   const handleUpdateCoordinatePosition = useCallback(
//     (id: string, xPercent: number, yPercent: number) => {
//       setDishes(
//         (prev) =>
//           prev.map((dish) =>
//             dish.id === id
//               ? { ...dish, coordinateXInMenu: xPercent, coordinateYInMenu: yPercent }
//               : dish,
//           ),
//         { record: false },
//       );
//     },
//     [setDishes],
//   );

//   // Commit drag operation to history for undo/redo
//   const handleCommitCoordinateDrag = useCallback(() => {
//     if (!dragHistoryBaseRef.current) return;

//     setDishes((current) => current, { historyBase: dragHistoryBaseRef.current });
//     dragHistoryBaseRef.current = null;
//   }, [setDishes]);

//   // ===== Dish Edit Handlers =====
//   // Update dish field (name, cost, prepTime, imageUrl)
//   const handleUpdateDishDataField = useCallback(
//     (id: string, field: EditableDishField, value: string) => {
//       setDishes((prev) =>
//         prev.map((dish) => (dish.id === id ? { ...dish, [field]: value } : dish)),
//       );
//     },
//     [setDishes],
//   );

//   // ===== Sync & Navigation Handlers =====
//   // Sync canvas view to show a specific page from data table
//   const handleSyncCanvasToRowPage = useCallback(
//     (targetPageId: string) => {
//       const targetIdx = menuPages.findIndex((page) => page.pageId === targetPageId);
//       if (targetIdx !== -1) setActivePageIndex(targetIdx);
//     },
//     [menuPages],
//   );

//   // Set focus to dish edit cell for quick editing
//   const handleRequestRowFocus = useCallback((id: string) => {
//     setActiveEditCell({ id, field: 'name' });
//   }, []);

//   const closeModal = useCallback(() => setModalOpen(false), []);

//   // ===== Export API =====
//   return {
//     // Page state
//     menuPages,
//     activePageIndex,
//     activePageObject,
//     // Dish state
//     computedDishesDataset,
//     activeEditCell,
//     setActiveEditCell,
//     // Sync status
//     syncStatus,
//     canUndo,
//     canRedo,
//     // File input refs
//     addPagesInputRef,
//     replacePageInputRef,
//     // Modal management
//     modal: {
//       isOpen: modalOpen,
//       mode: modalMode,
//       emptyPageNumbers: emptyPagesData,
//       invalidDishes: invalidDishesData,
//       activePageNumber: menuPages[activePageIndex]?.pageNumber,
//       close: closeModal,
//       onProceed: handleExecuteConfirmedAction,
//     },
//     // Event handlers
//     handlers: {
//       undo: handleUndoDishAction,
//       redo: handleRedoDishAction,
//       pageNext: handlePageNext,
//       pagePrevious: handlePagePrevious,
//       openAddPages: handleOpenAddPages,
//       openReplacePage: handleOpenReplacePage,
//       uploadLocalFiles: handleUploadedLocalFilesPipeline,
//       replaceCurrentPageImage: handleReplaceCurrentPageImage,
//       triggerDeleteConfirmation: handleTriggerDeleteConfirmation,
//       triggerSyncValidation: handleTriggerSyncValidationFlow,
//       addCoordinatePin: handleAddNewCoordinatePin,
//       deleteCoordinateRecord: handleDeleteCoordinateRecord,
//       startCoordinateDrag: handleStartCoordinateDrag,
//       updateCoordinatePosition: handleUpdateCoordinatePosition,
//       commitCoordinateDrag: handleCommitCoordinateDrag,
//       updateDishDataField: handleUpdateDishDataField,
//       syncCanvasToRowPage: handleSyncCanvasToRowPage,
//       requestRowFocus: handleRequestRowFocus,
//     },
//   };
// }
