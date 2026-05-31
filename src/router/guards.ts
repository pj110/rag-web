import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const loadingBar = useLoadingBar()

export const routerBeforeEach = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  loadingBar.start()
  // next()
  // console.log(to)
  // const userStore = useUserStore();
  next()
  // 已登录
  // if (userStore.TOKEN) {
  //   if (to.path === "/login") {
  //     next({ path: "/" });
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (to.path === "/login") {
  //     next();
  //   } else {
  //     next(`/login?redirect=${to.path}`);
  //   }
  // }
}

export const routerAfterEach = (): void => {
  loadingBar.finish()
}
