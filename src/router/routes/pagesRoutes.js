import { createRoute } from '@/router/helper/routeHelper.js';

/**
 * 自動產製Pages資料夾底下的約定式路由設定檔，會以動態載入的方式使用.vue元件檔
 * @returns
 */
export function generatePagesRoutes() {
  const pageComponents = import.meta.glob(['/src/pages/**/*.vue'], {
    eager: false,
  });
  return createRoute(pageComponents);
}
