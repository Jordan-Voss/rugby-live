import { defineConfig } from 'cf/config';
// Separate Worker, no bindings to Taghetti or Plateful. Secrets must be entered in hosting settings.
export default defineConfig({
 worker: {
  name:'rugby-live',
  entrypoint:'./worker/index.mjs',
  compatibilityDate:'2026-11-16',
  assets:{directory:'./dist/client',binding:'ASSETS',notFoundHandling:'single-page-application',runWorkerFirst:['/api/*']},
  observability:{enabled:true,traces:{enabled:true}},
 },
});
