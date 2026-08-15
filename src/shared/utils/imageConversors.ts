/**
 * Converts any image File object into a webp image File.
 * Highly optimized using createImageBitmap and OffscreenCanvas.
 * 
 * @param sourceFile - The original image File object (png, jpeg, etc.)
 * @param quality - Compression quality from 0.0 to 1.0 (default 0.85)
 */
export async function convertToWebP(
  sourceFile: File, 
  quality: number = 0.85
): Promise<File> {
  // 1. Decode the image on a background thread to keep the UI smooth
  const imageBitmap = await createImageBitmap(sourceFile);

  const { width, height } = imageBitmap;
  let blob: Blob | null = null;

  // 2. Use OffscreenCanvas if supported (fully off-main-thread operation)
  if (typeof OffscreenCanvas !== 'undefined') {
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d');
    if (!ctx) throw new Error('Could not get OffscreenCanvas context');
    
    ctx.drawImage(imageBitmap, 0, 0);
    blob = await offscreen.convertToBlob({ type: 'image/webp', quality });
  } else {
    // Fallback for older browsers
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get Canvas context');
    
    ctx.drawImage(imageBitmap, 0, 0);
    
    blob = await new Promise<Blob | null>((resolve) => 
      canvas.toBlob(resolve, 'image/webp', quality)
    );
  }

  // 3. Clean up the bitmap memory immediately
  imageBitmap.close();

  if (!blob) {
    throw new Error('WebP conversion failed');
  }

  // 4. Construct a new File object with a .webp extension
  const newFileName = sourceFile.name.replace(/\.[^/.]+$/, "") + ".webp";
  
  return new File([blob], newFileName, {
    type: 'image/webp',
    lastModified: Date.now()
  });
}

export const handleFilesParallel = async (files: File[]) => {
  try {
    // Map creates an array of Promises. Promise.all executes them in parallel.
    const webpFiles: File[] = await Promise.all(
      files.map(file => convertToWebP(file, 0.85))
    );

    console.log("All files converted:", webpFiles);
    return webpFiles;
  } catch (error) {
    console.error("One or more conversions failed", error);
  }
};