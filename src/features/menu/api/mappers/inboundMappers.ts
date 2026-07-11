import type { CloudDishItemPayload, CloudMenuGetPayload, CloudMenuPagePayload } from "@/features/menu/types/api.types";
import type { DishItem, Menu, MenuPage } from "@/features/menu/types/domain.types";


export function toDomainMenu(dto: CloudMenuGetPayload): Menu {
    return {
        menuPages: dto.menuPages.map(toDomainMenuPage),
        dishes: dto.dishes.map(toDomainDishItem)
    }
}

export function toDomainMenuPage(dto: CloudMenuPagePayload): MenuPage {
    return {
        pageId: dto.pageId,
        imageUrl: dto.imageUrl,
        pageNumber: dto.pageNumber
    }
}

export function toDomainDishItem(dto: CloudDishItemPayload): DishItem {
    return {
        id: dto.id,
        name: dto.name,
        imageUrl: dto.imageUrl,
        priceCents: dto.priceCents,
        prepTime: dto.prepTime,
        isOutOfStock: dto.isOutOfStock,
        parentPageId: dto.menuPageId,
        coordinateXInMenu: dto.coordinateXInMenu,
        coordinateYInMenu: dto.coordinateYInMenu,
        description: dto.description,
        createdAt: dto.createdAt
    }
}  

