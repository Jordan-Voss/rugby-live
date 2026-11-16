import data from '../shared/demo-data.json' with {type:'json'};
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function api(request){
 const u=new URL(request.url),path=u.pathname.replace(/^\/api\/v1/,'');
 if(request.method!=='GET')return json({error:'Method not allowed'},405);
 if(path==='/health')return json({status:'UP',mode:'sample',providerCalls:0,runtime:'preview-worker'});
 if(path==='/config')return json({mode:'sample',accountsAvailable:false,liveDataConnected:false,notificationsAvailable:false,defaultDate:data.defaultDate});
 if(path==='/bootstrap')return json(data);
 if(path==='/favourites')return json({error:'Accounts are not configured'},503);
 if(path==='/matches'){
  const date=u.searchParams.get('date'),team=u.searchParams.get('team'),competition=u.searchParams.get('competition');
  if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))return json({error:'Use YYYY-MM-DD'},400);
  return json(data.matches.filter(m=>(!date||date===m.date)&&(!team||team===m.homeId||team===m.awayId)&&(!competition||competition===m.competitionId)));
 }
 const match=path.match(/^\/(matches|teams|players|competitions)(?:\/([^/]+))?$/);
 if(match){const items=data[match[1]];if(!match[2])return json(items);const item=items.find(i=>i.id===decodeURIComponent(match[2]));return item?json(item):json({error:'Not found'},404);}
 return json({error:'Not found'},404);
}
