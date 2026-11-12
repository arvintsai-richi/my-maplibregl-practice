import { noMatchRoute } from '@/router/routes/basicRoutes.js';
import { generatePagesRoutes } from '@/router/routes/pagesRoutes.js';

// 越後面的優先度越高
export const routes = [noMatchRoute, ...generatePagesRoutes()];
