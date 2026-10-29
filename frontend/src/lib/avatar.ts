const OUTPUT_SIZE = 256;
const MAX_INPUT_BYTES = 15 * 1024 * 1024;
// Any image the browser can decode is fine: it is re-encoded to WebP/JPEG below,
// so the server only ever receives those formats.
export const AVATAR_ACCEPT = "image/*";

/**
 * Center-crops an image to a square and scales it to 256×256, returning a small WebP
 * (JPEG where WebP encoding is unsupported). Keeps uploads to a few dozen KB whatever
 * the original photo size.
 */
export async function prepareAvatar(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("That image is too large (max 15 MB)");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That image format isn't supported by your browser — try JPEG or PNG");
  }

  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing is not supported in this browser");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  bitmap.close();

  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.9));
  // Browsers without WebP encoding silently return PNG, which can be much larger.
  const webp = await encode("image/webp");
  const blob = webp?.type === "image/webp" ? webp : await encode("image/jpeg");
  if (!blob) throw new Error("Image processing failed");
  return blob;
}
