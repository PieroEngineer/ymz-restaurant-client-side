import { useCallback } from 'react';



export const useAssetDownload = () => {
//   const downloadFile = useCallback(({ fileUrl, fileName }: DownloadParams) => {
//     // Prevent execution if SSR or invalid inputs
//     if (!fileUrl || typeof window === 'undefined') return;

//     const link = document.createElement('a');
//     link.href = fileUrl;
//     link.download = fileName;
    
//     // Security Best Practice: Restrict opening dynamic links in unexpected windows
//     link.rel = 'noopener noreferrer';

//     document.body.appendChild(link);
//     link.click();
    
//     // Clean up DOM node immediately
//     document.body.removeChild(link);
//   }, []);

  /**
   * For cross-origin or dynamic assets requiring blob conversion
   * (Prevents browser from opening image in a new tab instead of downloading)
   */
  const downloadBlob = useCallback(async (fileUrl: string, fileName = "Póster para imprimir.webp") => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up memory to avoid memory leaks in Single Page Applications
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, []);

  return { /*downloadFile,*/ downloadBlob };
};