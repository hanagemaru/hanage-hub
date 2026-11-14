// Public HTTP reads only. Never changes DNS/Routes/Workers.
for (const address of [
  'https://hanage.app/',
  'https://www.hanage.app/',
  'https://www.hanage.app/games/putt/',
  'https://www.hanage.app/games/putt/play/',
]) {
  try {
    const response = await fetch(address, { redirect: 'manual', signal: AbortSignal.timeout(12000) });
    const location = response.headers.get('location');
    const redirectHost = location ? new URL(location, address).host : null;
    const redirectPath = location ? new URL(location, address).pathname : null;
    console.log(JSON.stringify({ url: address, status: response.status, redirectHost, redirectPath }));
  } catch (error) {
    console.log(JSON.stringify({ url: address, status: 'network-error', message: String(error).slice(0, 90) }));
  }
}
