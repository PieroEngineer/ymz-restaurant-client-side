import { useState } from "react";


export function useLocalPageMap() {
    const [localPageFilesMap, setLocalPageFilesMap] = useState<Record<string, File>>({});

    return {
        localPageFilesMap,
        
        onResetLocalImageMap: () => setLocalPageFilesMap({}),
       
        onStackNewLocalImagesInMap: (newFileEntries: Record<string, File>) => setLocalPageFilesMap((prev) => ({ ...prev, ...newFileEntries })),
        
        onRemoveLocalImageFromMap: (pageIdToDestroy: string) => {
            setLocalPageFilesMap((prevMap) => {
                const updatedMap = { ...prevMap };
                delete updatedMap[pageIdToDestroy];
                return updatedMap;
            });
        },
       
        onReplaceLocalImageInMap: (targetPageId: string, targetFile: File) => {
            setLocalPageFilesMap((prevMap) => ({
                ...prevMap,
                [targetPageId]: targetFile,
            }));
        },
    }

}