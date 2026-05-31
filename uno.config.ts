import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { defineConfig, presetIcons, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      prefix: '',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
        'width': '1em',
        'height': '1em',
      },
      collections: {
        icon: FileSystemIconLoader('./src/assets/icons'),
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
  shortcuts: {
    container: 'mx-auto w-[var(--pc-wrap-w)]',
  },
  theme: {
    colors: {
      primary: 'var(--color-primary)',
    },
    height: {
      'safe-screen': 'var(--screen-height)',
    },
    breakpoints: {
      // 自定义媒体查询尺寸
      design: '1440px',
    },
    width: {
      wrap: 'var(--pc-wrap-w)',
    },
  },
})
