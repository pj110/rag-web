<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
import { themeOverrides } from '@/theme/index'

const route = useRoute()
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <n-dialog-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
