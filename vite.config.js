import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

const ENV_PATH = './envs';

export default async ({ mode }) => {
  const basePath = loadEnv(mode, ENV_PATH).VITE_PUBLIC_PATH;

  const devServerConfig = {
    port: 53558,
    strictPort: true,
    https: await getDevCertificate(mode),
    proxy: {
      '/api': {
        target: 'https://localhost:56354/api/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/cadaster': {
        target: 'https://bip.richitech.com.tw/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cadaster/, ''),
      },
    },
  };

  return defineConfig({
    base: basePath,
    server: devServerConfig,
    build: {
      target: 'esnext',
    },
    esbuild: {
      drop: ['debugger'],
    },
    envDir: ENV_PATH,
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    },
    plugins: [vue()],
  });
};

async function getDevCertificate(mode) {
  const isDev = mode === 'development';

  if (!isDev) {
    return null;
  }

  // ./scripts/make-certificate.js can be deleted when the mode is not in "development"
  try {
    return (await import('./scripts/make-certificate.js'))?.default();
  } catch (e) {
    throw e;
  }
}
