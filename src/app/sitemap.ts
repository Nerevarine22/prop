import type { MetadataRoute } from 'next';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/prop-firms`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/compare`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/rewards`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/methodology`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteConfig.url}/coupons`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteConfig.url}/transparency`, changeFrequency: 'weekly', priority: 0.5 },
  ];

  const firmRoutes: MetadataRoute.Sitemap = MOCK_PROP_FIRMS.map((firm) => ({
    url: `${siteConfig.url}/prop-firms/${firm.slug}`,
    lastModified: firm.lastReviewedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...firmRoutes];
}
