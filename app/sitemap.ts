// client/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.elbermarket.com';
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/market`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Fetch live commodities and add to sitemap
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commodities?limit=100`);
    const data = await res.json();
    
    if (data.success && data.data) {
      const commodityPages = data.data.map((commodity: any) => ({
        url: `${baseUrl}/market/${commodity._id}`,
        lastModified: new Date(commodity.createdAt || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
      
      return [...staticPages, ...commodityPages];
    }
  } catch (error) {
    console.error('Error fetching commodities for sitemap:', error);
  }

  return staticPages;
}