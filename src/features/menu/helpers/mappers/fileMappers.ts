import type { MenuPage } from "@/features/menu/types/domain.types"

export function fromFilesToMenuPages(files: FileList, existingPageCount: number): MenuPage[] {
    return Array.from(files).map( (file, index) => {
        return{
            pageId: crypto.randomUUID(),
            imageUrl: URL.createObjectURL(file),
            pageNumber: existingPageCount + index + 1
        }
    } )

}