// src/utils/slug.ts
// 2025/cracking-the-code/cracking-the-code -> cracking-the-code
export function getPostSlug(id: string): string {
  const parts = id.split('/');
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
}
