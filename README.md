### 项目启动

- **要求**

  > Runtime: Node >= v18.18.x
  >
  > Package Manager: pnpm >= 8.x
  >
  > icon 以小写命名，多个单词用中划线分割，例如： `icon-user-add`

```sh
# 安装依赖
pnpm i

# 启动服务
pnpm run dev
```

### 目录结构

```ini
├── src
|   ├── assets                  静态资源
|   |   ├── icons               图标文件
|   |   |   └── ...
|   |   └── images              图片文件
|   |       └── ...
|   |
|   ├── components              公共组件
|   |   └── ...
|   |
|   ├── composables             可复用，拥有内部状态的hook文件
|   |   ├── ...
|   |   └── index.ts            导出此包下所有文件
|   |
|   ├── design                  样式文件
|   |   ├── index.ts            导出此包下所有样式文件
|   |   └── base.css            基础样式
|   |
|   ├── layouts                 layouts布局
|   |   ├── menus.vue           左侧菜单
|   |   └── blank.vue           右侧面板
|   |
|   ├── modules                 插件安装文件
|   |   ├── ...
|   |   ├── index.ts            导出此包下所有插件文件
|   |
|   ├── requests                请求文件
|   |   ├── ...
|   |   └── index.ts            请求封装
|   |
|   ├── shared                  工具函数文件
|   |   ├── ...
|   |
|   ├── stores                  pinia全局状态文件
|   |   ├── ...
|   |
|   ├── types                   类型声明文件
|   |   ├── ...
|   |
|   ├── views                   页面文件
|   |   └── [...all].vue        404页面
|   |   └── index.vue           首页
|   |
|   ├── main.ts                 项目入口文件
└───└── app.vue                 项目入口组件
```

### 提交规范

```sh
type(scope): subject

# 破坏性更新
# type(scope)!: subject
```
> - **type**`[必须]`: commit 的类别，只允许使用下面几个标识
    >
    >   - feat     - 新功能
>   - fix      - 修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG
>   - docs     - 文档注释
>   - style    - 调整代码格式，未修改代码逻辑（比如修改空格、格式化、缺少分号等）
>   - refactor - 代码重构，既没修复bug也没有添加新功能
>   - perf     - 性能优化，提高性能的代码更改
>   - test     - 添加或修改代码测试
>   - chore    - 构建过程或辅助工具的变动
>   - revert   - 回退
>   - build    - 打包
>
> - **scope**`[可选]`: 用于说明 commit 影响的范围，比如数据层、控制> 层、视图层等等，视项目不同而不同。
>
> - **subject**`[必须]`: commit 的简短描述

