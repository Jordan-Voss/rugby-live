import {api} from './api.mjs';
// Cloudflare serves static assets; only API requests reach this handler.
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/')){
  // A fixed, owner-configured upstream keeps the Java API behind one app origin.
  // Leave unset for the explicitly labelled sample API. Never accept an upstream from a request.
  if(env.RUGBY_API_ORIGIN){
   const origin=new URL(env.RUGBY_API_ORIGIN);
   if(origin.protocol!=='https:')return Response.json({error:'API origin must use HTTPS'},{status:503});
   const upstream=new URL(url.pathname+url.search,origin);
   try{return await fetch(new Request(upstream,request));}catch{return Response.json({error:'API is temporarily unavailable'},{status:502});}
  }
  return api(request);
 }
 return env.ASSETS.fetch(request);
}};
