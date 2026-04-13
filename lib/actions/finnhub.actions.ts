'use server';

import { formatArticle, getDateRange, validateArticle } from '@/lib/utils';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const res = await fetch(url, {
    ...(revalidateSeconds !== undefined
      ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
      : { cache: 'no-store' }),
  });

  if (!res.ok) throw new Error(`Finnhub request failed: ${res.status} ${res.statusText}`);

  return res.json() as Promise<T>;
}

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  try {
    const { from, to } = getDateRange(5);

    if (symbols && symbols.length > 0) {
      const cleanedSymbols = symbols.map((s) => s.trim().toUpperCase());
      const articles: MarketNewsArticle[] = [];
      const maxRounds = 6;

      for (let round = 0; round < maxRounds; round++) {
        const symbol = cleanedSymbols[round % cleanedSymbols.length];
        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;

        const raw = await fetchJSON<RawNewsArticle[]>(url);

        const valid = raw.find(validateArticle);
        if (valid) {
          articles.push(formatArticle(valid, true, symbol, round));
        }
      }

      return articles.sort((a, b) => b.datetime - a.datetime);
    }

    const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
    const raw = await fetchJSON<RawNewsArticle[]>(url);

    const seen = new Set<string>();
    const deduped: RawNewsArticle[] = [];

    for (const article of raw) {
      const key = String(article.id) + '|' + (article.url ?? '') + '|' + (article.headline ?? '');
      if (!seen.has(key) && validateArticle(article)) {
        seen.add(key);
        deduped.push(article);
      }
      if (deduped.length >= 6) break;
    }

    return deduped.map((article, index) => formatArticle(article, false, undefined, index));
  } catch (e) {
    console.error('Error fetching news', e);
    throw new Error('Failed to fetch news');
  }
}
