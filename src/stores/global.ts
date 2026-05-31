import { pinia } from '@/modules'

export const useGlobalStore = defineStore(
  'GLOBAL',
  () => {
    const TOKEN = ref()

    const isAuth = computed(() => !!TOKEN.value)

    return { TOKEN, isAuth }
  },
  {
    persist: {
      paths: ['TOKEN'],
    },
  },
)

export const useGlobalStoreWithOut = () => useGlobalStore(pinia)
