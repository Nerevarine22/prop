import type { MetadataRoute } from 'next';
import { getPublicFirmProfiles } from '@/lib/services/publicFirmProfileService';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const firms = await getPublicFirmProfiles();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/prop-firms`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/compare`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/rewards`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteConfig.url}/methodology`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteConfig.url}/coupons`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteConfig.url}/transparency`, changeFrequency: 'weekly', priority: 0.5 },
  ];

  const firmRoutes: MetadataRoute.Sitemap = firms.map((firm) => ({
    url: `${siteConfig.url}/prop-firms/${firm.slug}`,
    lastModified: firm.checkedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...firmRoutes];
}
