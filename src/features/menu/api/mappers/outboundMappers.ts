import type { CloudDishItemPayload, CloudMenuGetPayload, CloudMenuPagePayload } from "@/features/menu/types/api.types";
import type { DishItem, Menu, MenuPage } from "@/features/menu/types/domain.types";

export function toRemoteMenu(local: Menu): CloudMenuGetPayload {
    return {
        menuPages: local.menuPages.map(toRemoteMenuPage),
        dishes: local.dishes.map(toRemoteDishItem)
    };
}

export function toRemoteMenuPage(local: MenuPage): CloudMenuPagePayload {
    return {
        pageId: local.pageId,
        imageUrl: local.imageUrl,
        pageNumber: local.pageNumber
    };
}

export function toRemoteDishItem(local: DishItem): CloudDishItemPayload {
    return {
        id: local.id,
        name: local.name,
        imageUrl: local.imageUrl,
        priceCents: local.priceCents,
        prepTime: local.prepTime,
        isOutOfStock: local.isOutOfStock,
        menuPageId: local.parentPageId,
        coordinateXInMenu: local.coordinateXInMenu,
        coordinateYInMenu: local.coordinateYInMenu,
        description: local.description,
        createdAt: local.createdAt
    };
}
