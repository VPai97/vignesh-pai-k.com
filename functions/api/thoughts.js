/**
 * Cloudflare Pages Function: GET /api/thoughts
 * Reads Vignesh's Substack RSS feed and returns the posts as JSON for /thoughts/.
 * Runs on Cloudflare (no server to manage). Responses are cached for 10 minutes.
 */

// Vignesh's Substack. Change only this line if the address changes.
const SUBSTACK = 'https://vigneshpai97.substack.com';

const MAX_POSTS = 50;

const decode = (s) =>
  s
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

const tag = (xml, name) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(xml);
  return m ? decode(m[1]) : '';
};

const httpsOnly = (u) => (/^https:\/\//i.test(u) ? u : '');

export function parseFeed(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.slice(0, MAX_POSTS).map((it) => {
    const enclosure = /<enclosure[^>]*url="([^"]+)"/.exec(it);
    const date = new Date(tag(it, 'pubDate'));
    return {
      title: tag(it, 'title'),
      subtitle: tag(it, 'description'),
      url: httpsOnly(tag(it, 'link')),
      date: isNaN(date) ? '' : date.toISOString().slice(0, 10),
      image: enclosure ? httpsOnly(decode(enclosure[1])) : '',
    };
  })
    // Substack adds a placeholder "Coming soon" post to new publications; don't show it.
    .filter((p) => p.title && p.url && p.title.trim().toLowerCase() !== 'coming soon');
}

// GET (and HEAD) only: Cloudflare answers other methods with 405 when only onRequestGet is exported.
export async function onRequestGet() {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=600',
    'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
    'referrer-policy': 'no-referrer',
  };
  try {
    const res = await fetch(`${SUBSTACK}/feed`, {
      headers: { 'user-agent': 'vignesh-pai-k.com feed reader' },
      cf: { cacheTtl: 600, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`feed returned ${res.status}`);
    const xml = await res.text();
    if (xml.length > 5_000_000) throw new Error('feed too large');
    const posts = parseFeed(xml);
    return new Response(JSON.stringify({ source: SUBSTACK, posts }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ source: SUBSTACK, posts: [], error: 'feed unavailable' }), {
      status: 502,
      headers: { ...headers, 'cache-control': 'no-store' },
    });
  }
}
