import { getCollection, type CollectionEntry } from 'astro:content';

type Draftable = 'blog' | 'projects' | 'vaults';

// Em `npm run dev` mostra os rascunhos; no build de produção esconde-os
export async function getPublished<C extends Draftable>(name: C): Promise<CollectionEntry<C>[]> {
  return getCollection(name, (entry) =>
    import.meta.env.DEV || !(entry.data as { draft?: boolean }).draft
  );
}
