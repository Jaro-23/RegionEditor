async function loadImage(url: string): Promise<ImageBitmap> {
  const response: Response = await fetch(url);
  const blob: Blob = await response.blob();
  return createImageBitmap(blob);
}

export { loadImage };
