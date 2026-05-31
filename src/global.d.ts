import type { App } from 'vue'

declare global {
  type ModuleInstaller = (context: App<Element>) => void

  /**
   * Promise, or maybe not
   */
  type Awaitable<T> = PromiseLike<T> | T

  /**
   * Null or whatever
   */
  type Nullable<T> = null | T | undefined

  /**
   * Array, or not yet
   */
  type Arrayable<T> = Array<T> | T

  /**
   * Infers the element type of array
   */
  type ElementOf<T> = T extends (infer E)[] ? E : never

  /**
   * Type utility to extract the underlying type from a promise type.
   */
  type UnPromisify<T> = T extends PromiseType<infer U> ? U : never

  type DeepReadonly<T> = {
    readonly [p in keyof T]: T[p] extends object ? DeepReadonly<T[p]> : T[p]
  }

  type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  type OptionalOmit<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>
}
