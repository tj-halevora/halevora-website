import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    files: ['components/Silk.jsx'],
    // Three.js shader uniforms are intentionally mutable in the upstream component.
    rules: { 'react-hooks/immutability': 'off' },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'media/**']),
]);
