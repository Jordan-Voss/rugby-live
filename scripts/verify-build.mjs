import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const get=path=>worker.fetch(new Request('https://rugbylive.jordanvoss.dev'+path));
assert.equal((await get('/')).status,200);
assert.match(await (await get('/')).text(),/RugbyLive/);
assert.equal((await get('/matches/example')).status,200);
assert.equal((await get('/missing.png')).status,404);
for(const name of ['logo-light','logo-dark','pitch','player','app-icon']){
 const response=await get('/brand/'+name+'.png');
 assert.equal(response.headers.get('content-type'),'image/png');
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('dist/client/brand/'+name+'.png'));
}
assert.equal((await get('/manifest.webmanifest')).headers.get('content-type'),'application/manifest+json');
const health=await(await get('/api/v1/health')).json();
assert.equal(health.mode,'sample');assert.equal(health.providerCalls,0);
assert.equal((await get('/api/v1/favourites')).status,503);
console.log('Packaged Worker verified: page, SPA routes, exact PNG bytes, manifest and sample API.');
