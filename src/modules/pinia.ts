import { createPinia } from 'pinia'
import statePersisted from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(statePersisted)

export const install: ModuleInstaller = (ctx) => {
  ctx.use(pinia)
}
