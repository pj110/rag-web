import { setGlobalOptions } from 'vue-request'
import app from '@/app.vue'
import '@/design'

// vueRequest全局配置
setGlobalOptions({
  loadingDelay: 300,
  loadingKeep: 600,
  throttleInterval: 1000,
})

const client = createApp(app)

const modules = import.meta.glob<{ install: ModuleInstaller }>('./modules/*.ts', { eager: true })

Object.values(modules).forEach(i => i.install?.(client))

client.mount('#app')
