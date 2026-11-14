/**
 * Dedicated, path-scoped redirect Worker. It must never modify the existing
 * www.hanage.app hub app or redirect a different route (Putt and other games).
 * All stateful game access is canonicalized to one hanage.app origin to avoid
 * creating separate player identities on www and the apex.
 */
const WWW_HOST = 'www.hanage.app';
const ROOT_HOST = 'hanage.app';
const PATH = '/games/putt/play';

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    if (url.hostname !== WWW_HOST ||
      !(url.pathname === PATH || url.pathname.startsWith(PATH + '/'))) {
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
