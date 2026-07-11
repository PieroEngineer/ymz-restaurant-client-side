import type {MenuPage} from '@/features/menu/types/domain.types';
import type { PresignedUrlMapping } from '@/features/menu/types/api.types';

export function injectRemoteUrlInPages(
  currentPages: MenuPage[],
  presignedUrls: PresignedUrlMapping[],
): MenuPage[]  {

  const finalSnapshotPages: MenuPage[] = currentPages.map((page) => {
    const tokenMatch = presignedUrls.find((mapping) => mapping.pageId === page.pageId);

    return {
      pageId: page.pageId,
      imageUrl: tokenMatch ? tokenMatch.publicUrl : page.imageUrl,
      pageNumber: page.pageNumber,
    };
  });

  return finalSnapshotPages;
}
