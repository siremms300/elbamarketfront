// client/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/warehouse',
          '/warehouse/*',
          '/farmer',
          '/farmer/*',
          '/login',
          '/register',
          '/api',
        ],
      },
    ],
    sitemap: 'https://www.elbermarket.com/sitemap.xml',
  };
}