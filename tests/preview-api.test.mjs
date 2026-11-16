import{test}from'node:test';import assert from'node:assert/strict';import{api}from'../worker/api.mjs';
const get=p=>api(new Request('https://example.test/api/v1'+p));
test('sample mode makes no provider calls',async()=>{assert.equal((await get('/health').json()).providerCalls,0);assert.equal((await get('/bootstrap').json()).mode,'sample')});
test('date validation and unknown entities',async()=>{assert.equal((await get('/matches?date=2026-11-14').json()).length,6);assert.equal(get('/matches?date=2026-02-30').status,400);assert.equal(get('/matches/missing').status,404)});
test('missing stats and zero stay distinct',async()=>{assert.equal((await get('/matches/gla-edi-demo').json()).stats,null);assert.equal((await get('/players/south-africa-p01').json()).stats.tries,0)});
test('accounts fail closed and mutations denied',()=>{assert.equal(get('/favourites').status,503);assert.equal(api(new Request('https://example.test/api/v1/matches',{method:'POST'})).status,405)});
