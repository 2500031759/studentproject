import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'elite-arena-react-route-fallback',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const pathname = request.url?.split('?')[0];
          if (pathname === '/login' || pathname === '/profile') {
            request.url = `/index.html${request.url?.includes('?') ? request.url.slice(request.url.indexOf('?')) : ''}`;
          }
          next();
        });
      },
    },
  ],
});
