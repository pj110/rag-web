import { createDiscreteApi } from 'naive-ui'

export const useLoadingBar = () => createDiscreteApi(
  ['loadingBar'],
  {
    loadingBarProviderProps: {
      loadingBarStyle: {
        loading: 'background:#0341C1',
      },
    },
  },
).loadingBar
