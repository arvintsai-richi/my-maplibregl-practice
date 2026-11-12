/**
 * Layout.vue為該層級路由的container，需包含<RouterView />來渲染子路由。
 */
const LAYOUT = 'Layout';

/**
 * Home.vue為預設子路由的元件。
 */
const HOME = 'Home';

const OK = 'OK';
const NOT_IMPL_YET = '尚未實作';
const ROOT_PAGE_NOT_FOUND = '找不到 /page/Home.vue 或是 /page/Home/Layout.vue';

let _routeStatus = {
  Home: ROOT_PAGE_NOT_FOUND,
};

/**
 * 建立pages資料夾底下的 vue router 路由
 * @param {Object} pageComponents
 * @returns
 */
export function createRoute(pageComponents) {
  const pagesRoutes = [];
  Object.keys(pageComponents).forEach((filePath) => {
    const routePath = computeRoutePath(filePath);

    // 迭代產製路由設定檔
    routePath
      .split('/')
      .reduce(createRouteReducer(filePath, pageComponents), pagesRoutes);
  });

  // Route paths should start with a "/"
  pagesRoutes.map((route) => {
    route.path = '/' + route.path;
    return route;
  });

  if (import.meta.env.DEV) {
    checkRouteStatus();
  }

  return pagesRoutes;
}

/**
 * 將檔案路徑轉換成路由路徑。
 * @param {String} filePath
 * @returns
 */
function computeRoutePath(filePath) {
  return (
    filePath
      // 去除 src/pages
      .replace('/src/pages/', '')
      // 去除 LAYOUT.vue
      .replace(`/${LAYOUT}.vue`, '')
      // 去除 .vue
      .replace(/.vue/, '')
      // 轉換動態路由 [foo]/[bar] => /:foo/:bar
      .replace(/\[([\w-]+)]/g, ':$1')
  );
}

/**
 * 接收filePath，並回傳Reduce Callback
 * @param {String} filePath
 * @param {Object} pageComponents
 * @returns
 */
function createRouteReducer(filePath, pageComponents) {
  return (
    routeChildren, // 當前路由節點的子路由Array
    currentPathName, // 當前層級的路由名稱 (原陣列目前所迭代處理中的元素)
    currentPathIndex, // 當前層級的路由索引
    routePathList, // 該檔案的原始路由層級陣列 (routePath.split("/"))
  ) => {
    const routeName = routePathList.slice(0, currentPathIndex + 1).join('-');

    let config = routeChildren.find((child) => child.name === routeName);

    // 若該節點的Route Config還沒建立，則先初始化一個config，待後續迭代補齊config資訊。
    if (!config) {
      _routeStatus[routeName] = NOT_IMPL_YET;

      config = {
        name: routeName,
        path: null,
        component: null,
        children: [],
        meta: {},
        props: true, // 為動態路由時，將 props 設為 true，則可直接透過 props 取得 route.params
      };

      routeChildren.push(config);
    }

    // 當遍歷到最後一個節點後，就將config資訊補齊。
    if (currentPathIndex === routePathList.length - 1) {
      config.path = currentPathName === HOME ? '' : currentPathName;
      config.component = pageComponents[filePath];
      // config.meta.permission = getPermission(config.component);

      _routeStatus[routeName] = OK;
    }

    return config.children;
  };
}

function getPermission(component) {
  if (!component?.permission) {
    throw new Error(`
      請在${component.__file}下加入權限設定
      <script>
        // declare additional options
        export default {
          permissions: ["role1", "role2"]
        }
      </script>
    `);
  }

  return component.permission;
}

/**
 * 確認是否每個route config都被正確建立。
 */
function checkRouteStatus() {
  const errorMsg = Object.entries(_routeStatus).reduce(
    (accumulator, currentValue) => {
      if (currentValue[1] == NOT_IMPL_YET) {
        accumulator.push(`找不到 ${currentValue[0]} 對應的 ${LAYOUT}.vue。`);
      } else if (currentValue[1] == ROOT_PAGE_NOT_FOUND) {
        accumulator.push(ROOT_PAGE_NOT_FOUND);
      }

      return accumulator;
    },
    [],
  );

  if (errorMsg.length) {
    console.group('建立pages資料夾底下的 vue router 路由');
    throw new Error(`pages router 建立失敗。\n${errorMsg.join('\n')}`);
  } else {
    console.groupCollapsed('建立pages資料夾底下的 vue router 路由');
    console.table(_routeStatus);
  }
  console.groupEnd();
}
