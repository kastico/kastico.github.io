import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export async function fullUrl(src: ImageMetadata | string, width = 2400) {
  if (typeof src === 'string') return src;
  const img = await getImage({ src, width: Math.min(width, src.width) });
  return img.src;
}
