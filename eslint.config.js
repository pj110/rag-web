import { defineConfig, presetVue } from 'witheslint'

export default defineConfig({
  presets: [presetVue()],
  extends: [
    {
      rules: {
        'no-undef': 'off',
        'style/brace-style': 'off',
        'style/no-multi-spaces': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-top-level-await': 'off',
      },
    },
  ],
})
