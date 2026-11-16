import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig({root:resolve(import.meta.dirname),plugins:[react()],build:{outDir:resolve(import.meta.dirname,'../../dist/client'),emptyOutDir:true},server:{host:'0.0.0.0',allowedHosts:true,proxy:{'/api':{target:process.env.RUGBY_API_URL||'http://127.0.0.1:8082'}}}});
