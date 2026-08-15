import type { MenuPage } from "@/features/menu/types/domain.types"

export function fromFilesToMenuPages(files: File[], existingPageCount: number): MenuPage[] {
    // Direct map without Array.from()
    return files.map((file, index) => {
        return {
            pageId: crypto.randomUUID(),
            imageUrl: URL.createObjectURL(file), // Note: Remember to revoke this later!
            pageNumber: existingPageCount + index + 1
        };
    });
}