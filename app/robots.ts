import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api', '/sign-in', '/sign-up'],
    },
    sitemap: 'https://proposligo.vercel.app/sitemap.xml',
  };
}
