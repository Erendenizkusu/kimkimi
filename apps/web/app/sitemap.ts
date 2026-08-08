import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths = ['', '/oyna', '/nasil-oynanir', '/gizlilik', '/kullanim'];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
