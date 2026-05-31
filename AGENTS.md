# AGENTS.md

> 本文件供 AI Coding Agent 阅读。项目主要使用中文进行注释和文档编写。

---

## 项目概述

本项目是一个基于 **Vue 3 + TypeScript + Vite** 构建的单页面营销展示型网站（Landing Page），面向成都云境文茵科技有限公司（产品品牌 Veplay）。

- **仓库名**: `our-website`
- **包名**: `short-drama-admin`（历史命名，实际为官网前端）
- **运行时**: Node >= v18.18.x
- **包管理器**: pnpm >= 8.x
- **开发语言**: TypeScript（`~5.3.3`）
- **构建工具**: Vite（`^4.5.2`）
- **UI 组件库**: naive-ui（`^2.36.0`）
- **样式方案**: UnoCSS（`^0.58.5`）

### 主要页面

- `/` — 首页，包含多个滚动区块（FrontPage / Challenge / Professional / Case / Bottom / Footer）
- `/*` — 404 页面（`[...all].vue`）

---

## 技术栈详情

| 领域 | 依赖 |
|---|---|
| 框架 | Vue `^3.3.13` |
| 路由 | `vue-router` + `unplugin-vue-router`（文件系统路由，自动类型） |
| 状态管理 | Pinia `^2.1.7` + `pinia-plugin-persistedstate` |
| HTTP | Axios（封装于 `src/requests/index.ts`） |
| 数据请求 | `vue-request`（全局配置 loadingDelay / loadingKeep / throttleInterval） |
| 工具库 | `@vueuse/core` / `@vueuse/integrations` / `@vueuse/router` |
| 头部管理 | `@unhead/vue` |
| 动画 | `animate.css` + `wow.js`（滚动触发动画） |
| 视频播放 | `video.js` + `@videojs-player/vue` |
| 时间处理 | `moment` |
| Cookie | `universal-cookie` |
| 构建插件 | `vite-plugin-compression`（Gzip 压缩） |

---

## 目录结构

```
src/
├── assets/               静态资源
│   ├── icons/            自定义 SVG 图标（通过 UnoCSS presetIcons 加载）
│   └── images/           图片文件
├── components/           公共组件（自动注册）
│   ├── Header.vue
│   └── Footer.vue
├── composables/          可复用组合式函数
│   ├── base.ts           useLoadingBar
│   └── dark.ts           isDark
├── constant/             常量定义
│   └── global.ts         languageType 等
├── design/               全局样式入口
│   ├── base.css          CSS 变量、基础样式、动画覆盖
│   └── index.ts          导入 virtual:uno.css、reset、base.css
├── modules/              插件安装文件（通过 install 函数注册到 App）
│   ├── pinia.ts          Pinia + persistedstate
│   ├── router.ts         vue-router 配置（文件系统路由 + 守卫）
│   └── index.ts          统一导出
├── requests/             HTTP 请求封装
│   └── index.ts          Axios 实例（Requests 类），含拦截器
├── router/               路由守卫
│   └── guards.ts         全局 beforeEach / afterEach
├── shared/               工具函数
│   └── utils.ts          importAssets 等
├── stores/               Pinia Store
│   └── global.ts         useGlobalStore（TOKEN、isAuth，持久化）
├── theme/                naive-ui 主题覆盖
│   └── index.ts
├── types/                类型声明文件
│   └── index.ts
├── views/                页面文件（文件系统路由）
│   ├── index/
│   │   ├── index.vue     首页
│   │   └── components/   首页子组件
│   └── [...all].vue      404 页面
├── app.vue               根组件（n-config-provider 包裹）
├── main.ts               入口文件（加载 design、初始化 vue-request、安装 modules）
├── components.d.ts       unplugin-vue-components 自动生成
├── router.d.ts           unplugin-vue-router 自动生成
└── imports.d.ts          unplugin-auto-import 自动生成
```

---

## 构建与运行命令

```bash
# 安装依赖
pnpm i

# 本地开发（端口 8080）
pnpm dev

# TypeScript 类型检查（不输出文件）
pnpm build:check

# 生产构建
pnpm build:mode:prod

# 预览生产构建
pnpm preview

# 先构建再预览
pnpm preview:build
```

### 环境变量

项目使用 `.env.development` 和 `.env.production`：

| 变量 | 说明 |
|---|---|
| `VITE_API_BASE_URL` | 后端 API 基地址（不同环境指向不同内网/公网地址） |
| `VITE_API_PLATFORM_NAME` | 平台名称（如 `Veplay管理后台`） |

---

## 代码风格与开发约定

### 编辑器配置

- **EditorConfig**: 2 空格缩进、UTF-8、LF 换行、自动去除行尾空格
- **ESLint**: 使用 `witheslint` 的 `presetVue()`，Flat Config 模式
- **VS Code**: 保存时自动执行 `source.fixAll.eslint`，已启用 Flat Config 实验支持

### 提交规范

项目使用 **Conventional Commits**，由 `@commitlint/config-conventional` 校验。

```
type(scope): subject
```

允许的 **type**：
- `feat` — 新功能
- `fix` — 修复 bug
- `docs` — 文档/注释
- `style` — 代码格式调整（空格、格式化、分号等，不影响逻辑）
- `refactor` — 重构（既不修复 bug 也不添加功能）
- `perf` — 性能优化
- `test` — 添加/修改测试
- `chore` — 构建过程或辅助工具变动
- `revert` — 回退
- `build` — 打包

**Git Hooks**（通过 `lefthook` 管理）：
- `pre-commit`: 对暂存的 `*.{js,ts,vue}` 文件执行 `pnpm eslint --fix`
- `commit-msg`: 执行 `pnpm commitlint --edit` 校验提交信息格式

### 图标命名规范

> 图标以小写命名，多个单词用中划线分割，例如：`icon-user-add`

自定义图标存放于 `src/assets/icons/`，通过 UnoCSS `presetIcons` 以 `icon:xxx` 形式使用。

### 自动导入

项目大量依赖**自动导入**，无需手动 import：

- **Vue / Pinia / VueUse / vue-request / vue-router(auto) / @unhead/vue** 的核心 API
- **目录级自动导入**: `src/composables/`、`src/requests/`、`src/shared/`、`src/stores/`、`src/context/`、`src/constant/` 下的文件
- **组件自动注册**: `src/components/**/*.vue` 以及 naive-ui 组件

> 注意：`src/context/` 目录当前不存在，但已配置在 auto-import 的 dirs 中。

---

## 路由与布局

路由采用 **`unplugin-vue-router`** 的文件系统路由方案：

- 页面文件放在 `src/views/`，自动生成路由表和类型声明
- 所有路由默认 `importMode: 'async'`（异步加载）
- 路由名称使用 PascalCase（`getPascalCaseRouteName`）
- 支持在 `<route lang="yaml">` 块中写路由元信息

### 布局（Layout）

当前代码在 `src/modules/router.ts` 中设置了默认布局：

```ts
basicRoute.meta ??= {}
basicRoute.meta.layout ??= 'menus'
```

但 **项目当前没有 `src/layouts/` 目录**，且 `app.vue` 中直接使用 `<router-view />` 而没有根据 `meta.layout` 动态切换布局组件。这意味着 `layout` 字段目前仅作标记，实际布局切换逻辑尚未实现（或已移除）。

404 页面显式声明了 `layout: blank`：

```yaml
<route lang="yaml">
meta:
  layout: blank
</route>
```

---

## 状态管理

使用 **Pinia** + **`pinia-plugin-persistedstate`**：

- `src/stores/global.ts`: 定义了 `useGlobalStore`，包含 `TOKEN` 和 `isAuth`
- 持久化配置仅保留 `paths: ['TOKEN']`，数据存储在 localStorage 中

> 注意：请求拦截器（`src/requests/index.ts`）读取 token 时，直接解析 `localStorage.getItem('USER_INFO')` 的 JSON，而非从 Pinia store 获取。两处 token 存储方式不一致，修改时需同时关注。

---

## HTTP 请求层

`src/requests/index.ts` 封装了一个 `Requests` 类：

- **Base URL**: 读取 `import.meta.env.VITE_API_BASE_URL`
- **超时**: 60 秒
- **拦截器**:
  - Request: 从 `localStorage.USER_INFO.TOKEN` 取出 token 写入 `Authorization: Bearer ${token}`；GET 请求自动追加时间戳参数 `temp`
  - Response: 仅当 `code === 200` 时返回 `data.data`；`code === 413 / 401` 时清除用户状态并跳转到 `/login`；其余错误码弹出错误提示

公开方法：`get`、`post`、`put`、`delete`、`request`、`tansParams`

---

## 样式与主题

### UnoCSS

配置在 `uno.config.ts`：

- Presets: `presetUno()` + `presetIcons()`
- 自定义图标集: `icon:` 前缀对应 `src/assets/icons` 下的 SVG 文件
- 快捷类: `container` = `mx-auto w-[var(--pc-wrap-w)]`
- 主题色: `primary` = `var(--color-primary)`
- 自定义断点: `design: '1440px'`
- Transformer: `transformerVariantGroup()`

### CSS 变量

主要设计 token 定义于 `src/design/base.css`：

| 变量 | 值 | 说明 |
|---|---|---|
| `--pc-wrap-w` | `1200px` | 页面内容区最大宽度 |
| `--color-primary` | `#356EFF` | 主色 |
| `--screen-height` | `calc(100vh - safe-area)` | 安全区域屏高 |
| `---bg-color` | `#ffffff` | 背景色 |
| `---page-p` | `19px` | 页面内边距 |
| `---page-radius` | `8px` | 圆角 |
| `---page-mt` | `15px` | 页面顶部间距 |

根字体大小设置为 `html { font-size: 4px; }`，因此 UnoCSS 的 `text-14` 等工具类基于 rem 换算时对应 `56px`（`14 * 4`），但实际代码中大量直接使用 `text-14` 表示 `14px` 效果，这是因为 UnoCSS 预设可能已做特殊处理，或代码中数值直接对应目标像素值。**开发时应按现有写法保持风格一致**。

---

## 测试说明

**本项目当前没有测试套件**。没有 Jest/Vitest/Playwright 等测试依赖，也没有 `*.test.*` 或 `*.spec.*` 文件。

如需添加测试，建议：
- 单元测试：使用 Vitest（与 Vite 同生态）
- E2E 测试：使用 Playwright

---

## 部署流程

项目使用 **GitLab CI**（`.gitlab-ci.yml`）进行部署：

- **触发条件**: `develop` 分支，手动触发（`when: manual`）
- **构建步骤**:
  1. 安装 pnpm `8.6.8`
  2. `pnpm install`
  3. `pnpm build:mode:prod`
  4. `rsync -av --delete dist <server>:/yjyy-data/nginx/web/`
- **缓存**: `node_modules/` 按分支缓存

> 生产构建产物输出到 `dist/` 目录。

---

## 安全与注意事项

1. **敏感信息**: 历史提交中曾删除敏感内容（见 `git log`：`fix: 敏感内容删除`）。开发时请勿将密钥、密码、内网地址等硬编码到源码中提交；应通过环境变量或 CI/CD 变量注入。
2. **Token 存储**: 项目使用 localStorage 存储用户 token（`USER_INFO`），存在 XSS 风险。若后续升级为管理系统，建议评估是否需要迁移到 `httpOnly` Cookie。
3. **CORS**: 开发环境 API 指向内网地址（`192.168.x.x`），需确保开发机网络可达。
4. **路由守卫**: 当前 `routerBeforeEach` 中的登录校验逻辑被注释掉了，实际未启用登录拦截。若启用，需同步检查 `useUserStore` 是否存在（当前代码中未定义该 store）。
5. **硬编码邮箱与备案号**: Footer 组件中硬编码了公司邮箱（`cooperation@asvelaris.com`、`support@asvelaris.com`）和 ICP 备案号（`蜀ICP备2024112417号`），修改时需同步更新。

---

## Agent 开发建议

- **新增页面**: 在 `src/views/` 下创建 `.vue` 文件即可，路由会自动生成。如需自定义路由元信息，添加 `<route lang="yaml">` 块。
- **新增组件**: 放入 `src/components/` 即可全局自动注册，无需手动 import。
- **新增工具函数/hook**: 放入 `src/shared/` 或 `src/composables/` 即可自动导入。
- **修改请求逻辑**: 统一在 `src/requests/index.ts` 中调整拦截器或封装方法。
- **修改全局样式/CSS 变量**: 在 `src/design/base.css` 中修改。
- **修改主题色**: 调整 `src/design/base.css` 的 `--color-primary` 以及 `src/theme/index.ts` 的 naive-ui `themeOverrides`。
- **提交前**: 确保通过 `pnpm build:check` 无类型错误，并通过 ESLint 检查。
