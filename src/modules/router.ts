import { createRouter, createWebHistory } from 'vue-router/auto'
import { routerAfterEach, routerBeforeEach } from '@/router/guards'

/**
 * Note: 路由配置项
 *
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
     title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
     icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
     breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
   }
 */

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: (routes) => {
    routes.forEach((basicRoute) => {
      basicRoute.meta ??= {}
      basicRoute.meta.layout ??= 'menus'
    })
    return routes
  },
  scrollBehavior(to, from, savedPosition) {
    // console.log('我走了这里', from, to)
    // if (!from.hash) {
    //   router.replace('/')
    // }
    // // 如果目标路由包含锚点
    // if (to.hash) {
    //   return {
    //     el: to.hash, // 直接滚动到目标锚点
    //     behavior: 'smooth', // 滚动动画
    //   }
    // }
    // // 如果有保存的滚动位置则返回
    // if (savedPosition) {
    //   return savedPosition
    // }
    // 默认滚动到页面顶部
    return { top: 0 }
  },
})

router.beforeEach(routerBeforeEach)
router.afterEach(routerAfterEach)

export const install: ModuleInstaller = (ctx) => {
  ctx.use(router)
}
