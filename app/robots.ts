import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // private bzw. login-pflichtige Bereiche und API gehören nicht in den Index.
      // '/recipes$' (mit $) sperrt nur exakt /recipes – ohne $ wäre auch
      // /recipesdetails/... gesperrt, weil Disallow ein Präfix-Match ist.
      disallow: ['/api/', '/create', '/edit/', '/myrecipes', '/recipes$', '/login'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
