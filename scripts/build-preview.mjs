import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {extname} from 'node:path';

// A self-contained direct-upload Worker, including the sample API. The regular
// Worker/Static Assets entrypoint is worker/index.mjs for future cf deployments.
const assets = {};
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.ico':'image/x-icon','.webp':'image/webp'};
async function scan(dir, prefix='') {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const path = prefix + '/' + entry.name;
    if (entry.isDirectory()) await scan(dir+'/'+entry.name, path);
    else {
      const bytes = await readFile(dir+'/'+entry.name);
      const binary = ['.png','.ico','.webp'].includes(extname(entry.name));
      assets[path] = {body:bytes.toString(binary?'base64':'utf8'),binary,type:types[extname(entry.name)]||'application/octet-stream'};
    }
  }
}
await scan('dist/client');
let source = await readFile('worker/api.mjs','utf8');
source = source.replace(/import data from[^;]+;/,`const data=${await readFile('shared/demo-data.json','utf8')};`);
await mkdir('dist/server',{recursive:true});
await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js', source + `
const assets=${JSON.stringify(assets)};
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if(url.pathname.startsWith('/api/')) return api(request);
    if(!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405});
    const asset = assets[url.pathname] || (!url.pathname.split('/').pop().includes('.') ? assets['/index.html'] : null);
    if(!asset) return new Response('Not found',{status:404});
    const body = asset.binary ? Uint8Array.from(atob(asset.body),char=>char.charCodeAt(0)) : asset.body;
    return new Response(request.method==='HEAD'?null:body,{headers:{
      'Content-Type':asset.type,
      'X-Content-Type-Options':'nosniff',
      'Cache-Control':url.pathname.startsWith('/assets/')?'public,max-age=31536000,immutable':'no-cache'
    }});
  }
};`);
await writeFile('dist/.openai/hosting.json', await readFile('.openai/hosting.json'));
console.log('Packaged sample API and '+Object.keys(assets).length+' assets.');
