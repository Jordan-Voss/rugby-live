import{spawn}from'node:child_process';
const java=process.env.JAVA_HOME?process.env.JAVA_HOME+'/bin/java':'java';
const api=spawn(java,['-jar','apps/api/target/rugby-live-api-0.1.0.jar'],{stdio:'inherit',env:{...process.env,PORT:'8082'}});
const web=spawn('node',['node_modules/vite/bin/vite.js','--config','apps/web/vite.config.ts','--port',process.env.PORT||'5173',...process.argv.slice(2)],{stdio:'inherit',env:process.env});
function stop(){web.kill();api.kill();}process.on('SIGTERM',stop);process.on('SIGINT',stop);web.on('exit',code=>{api.kill();process.exit(code||0)});
