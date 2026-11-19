import type { APIRoute } from 'astro';
import {
  VIETNAM_PROVINCES,
  MAJOR_LOGISTICS_HUBS,
  searchLocations,
  removeVietnameseTones,
} from '../../../content/vietnam-provinces.ts';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  const region = url.searchParams.get('region') || '';
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : query ? 10 : 63;

  // If a search query is provided, use fuzzy Vietnamese search
  if (query.trim()) {
    const suggestions = searchLocations(query, limit);
    return new Response(
      JSON.stringify({
        success: true,
        query,
        count: suggestions.length,
        data: suggestions,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Filter by region if specified
  let provinces = VIETNAM_PROVINCES;
  if (region.trim()) {
    const cleanRegion = removeVietnameseTones(region);
    provinces = provinces.filter((p) =>
      removeVietnameseTones(p.region).includes(cleanRegion)
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      total: provinces.length,
      source: 'Nam Hân Logistics Administrative Dataset (GSO 63 Provinces)',
      hubs: MAJOR_LOGISTICS_HUBS,
      data: provinces.slice(0, limit),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

