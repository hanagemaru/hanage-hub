/**
 * Dedicated, path-scoped redirect Worker. It must never modify the existing
 * www.hanage.app hub app or redirect anything beyond game play paths.
 * All stateful game access is canonicalized to one hanage.app origin to avoid
 * creating separate player identities on www and the apex.
 */
const WWW_HOST = 'www.hanage.app';
const ROOT_HOST = 'hanage.app';
const PATHS = ['/games/putt/play', '/games/multicolor-sweeper/play'];

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    if (url.hostname !== WWW_HOST ||
      !PATHS.some(path => url.pathname === path || url.pathname.startsWith(path + '/'))) {
      return new Response('Not found', { status: 404 });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Use the canonical game URL', { status: 405 });
    }
    url.hostname = ROOT_HOST;
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        'Cache-Control': 'no-store',
      },
    });
  },
};
