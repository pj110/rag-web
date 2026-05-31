/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'wow.js' {
  export default class WOW {
    constructor(options?: WOWOptions)
    init(): void
  }

  export interface WOWOptions {
    boxClass?: string
    animateClass?: string
    offset?: number
    mobile?: boolean
    live?: boolean
    callback?: (box: HTMLElement) => void
    scrollContainer?: string | null
  }
}
