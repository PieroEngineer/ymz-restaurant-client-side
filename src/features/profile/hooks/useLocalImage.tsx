import type { Restaurant } from "@/features/profile/types/domain.types";
import type { ImageSource, RestaurantImages } from "@/features/profile/types/support/imageManage.types";
import { convertToWebP } from "@/shared/utils/imageConversors";
import { useState } from "react";


export function useLocalImage(
    qrUrl: string,
    logoUrl: string,
    dishesToShow: [string, string, string],
    onUpdateIndividualImageUrl: (fieldName: keyof Omit<Restaurant, "dishesToShow" | "coordinates">, newValue: string) => void,
    onUpdateCollectionImageUrl: (position: 0 | 1 | 2, newImageUrl: string) => void
){

    const [localQrImage, setLocalQrImage] = useState<ImageSource>({ url: qrUrl, file: null });
    const [localLogoImage, setLocalLogoImage] = useState<ImageSource>({ url: logoUrl, file: null });
    const [localFrontImages, setLocalFrontImages] = useState<ImageSource[]>([
        { url: dishesToShow[0], file: null },
        { url: dishesToShow[1], file: null },
        { url: dishesToShow[2], file: null }
    ]);

    const onLocalImageImported = async (event: React.ChangeEvent<HTMLInputElement>, selectedImage: RestaurantImages | null) => {
        if (!selectedImage) return;
        
        const { files } = event.target;
        if (!files || files.length === 0) return;
    
        const targetFile = files[0];
        const webpTargetFile = await convertToWebP(targetFile)
        const associatedUrl = URL.createObjectURL(webpTargetFile)

        switch (selectedImage) {
            case "QR":
                setLocalQrImage({ url: associatedUrl, file: webpTargetFile });
                onUpdateIndividualImageUrl('qrUrl', associatedUrl)
                break;

            case "LOGO":
                setLocalLogoImage({ url: associatedUrl, file: webpTargetFile });
                onUpdateIndividualImageUrl('logoUrl', associatedUrl)
                break;

            case 'FRONT1':
                setLocalFrontImages((prevImages) => [
                    { url: associatedUrl, file: webpTargetFile },
                    prevImages[1],
                    prevImages[2]
                ]);
                onUpdateCollectionImageUrl(0, associatedUrl)
                break;

            case 'FRONT2':
                setLocalFrontImages((prevImages) => [
                    prevImages[0],
                    { url: associatedUrl, file: webpTargetFile },
                    prevImages[2]
                ]);
                onUpdateCollectionImageUrl(1, associatedUrl)
                break;

            case 'FRONT3':
                setLocalFrontImages((prevImages) => [
                    prevImages[0],
                    prevImages[1],
                    { url: associatedUrl, file: webpTargetFile }
                ]);
                onUpdateCollectionImageUrl(2, associatedUrl)
                break;

            default:
                break;
        }

        event.target.value = '';
    }

    return{
        qrImageUrl: localQrImage.url,

        logoImageUrl: localLogoImage.url,

        frontImagesUrls: localFrontImages.map(image => image.url),

        onLocalImageImported,

    }

}