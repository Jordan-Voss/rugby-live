import {defineConfig} from 'cf/config';

// The first release is deliberately self-contained: original app assets plus
// the sample-only API, with no database/provider credentials or paid bindings.
export default defineConfig({
  accountId:'a4a8a6977c12dfe478ec3ce8323a1546',
  worker:{
    name:'rugby-live',
    entrypoint:'./dist/server/index.js',
    compatibilityDate:'2026-11-16',
    domains:['rugbylive.jordanvoss.dev'],
    observability:{enabled:true},
  },
});
