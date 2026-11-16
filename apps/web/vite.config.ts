import { defineConfig,loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig(({mode})=>{
 const publicEnv=loadEnv(mode,process.cwd(),'VITE_API_');
 return {root:resolve(import.meta.dirname),plugins:[react()],envPrefix:[],define:{'import.meta.env.VITE_API_BASE_URL':JSON.stringify(publicEnv.VITE_API_BASE_URL||'')},build:{outDir:resolve(import.meta.dirname,'../../dist/client'),emptyOutDir:true},server:{host:'0.0.0.0',allowedHosts:true,proxy:{'/api':{target:process.env.RUGBY_API_URL||'http://127.0.0.1:8082'}}}};
});
