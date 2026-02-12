import { GiphyFetch } from '@giphy/js-fetch-api';

const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || '';

const gf = new GiphyFetch(API_KEY);

export interface GifResult {
    id: string;
    title: string;
    url: string;        // Original GIF URL
    previewUrl: string;  // Small preview for picker
    width: number;
    height: number;
}

export async function searchGifs(query: string, limit = 20): Promise<GifResult[]> {
    try {
        const { data } = query.trim()
            ? await gf.search(query, { limit, type: 'gifs' })
            : await gf.trending({ limit, type: 'gifs' });

        return data.map((gif) => ({
            id: gif.id.toString(),
            title: gif.title,
            url: gif.images.original.url,
            previewUrl: gif.images.fixed_width_small.url,
            width: gif.images.original.width,
            height: gif.images.original.height,
        }));
    } catch (error) {
        console.error('Giphy API error:', error);
        return [];
    }
}

export async function getTrendingGifs(limit = 20): Promise<GifResult[]> {
    return searchGifs('', limit);
}
