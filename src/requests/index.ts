import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
import { router } from '@/modules/router'

const useMessage = () => createDiscreteApi(['message']).message

const message = useMessage()

class Requests {
  private baseConfig: AxiosRequestConfig = {
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
    timeout: 60_000,
  }

  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.requestInterceptor()
    this.responseInterceptor()
  }

  /**
   * delete 请求
   * @param url
   * @param config
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  /**
   * 参数处理
   * @param {*} params  参数
   */
  public tansParams = (params: any) => {
    let result = ''
    for (const propName of Object.keys(params)) {
      const value = params[propName]
      const part = `${encodeURIComponent(propName)}=`
      if (value !== null && value !== '' && value !== undefined) {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (
              value[key] !== null
              && value[key] !== ''
              && value[key] !== undefined
            ) {
              const params = `${propName}[${key}]`
              const subPart = `${encodeURIComponent(params)}=`
              result += `${subPart + encodeURIComponent(value[key])}&`
            }
          }
        } else {
          result += `${part + encodeURIComponent(value)}&`
        }
      }
    }
    return result
  }

  /**
   * get 请求
   * @param url
   * @param config
   * @param params
   */
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    params?: any,
  ): Promise<T> {
    let newUrl = url
    if (params) {
      newUrl = `${newUrl}?${this.tansParams(params)}`
      newUrl = newUrl.slice(0, -1)
    }
    return this.instance.get(newUrl, config)
  }

  /**
   * post 请求
   * @param url
   * @param data
   * @param config
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * put 请求
   * @param url
   * @param data
   * @param config
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * request 请求
   * @param config
   */
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  /**
   * request 拦截器
   * @private
   */
  private requestInterceptor(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token: string | undefined = JSON.parse(
          localStorage.getItem('USER_INFO') || '{}',
        ).TOKEN

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        if (config.method && /get/i.test(config.method)) {
          config.params = config.params || {}
          config.params.temp = (Date.now() / 1000).toFixed(0)
        }
        return config
      },
      (error: any) => {
        return Promise.reject(error)
      },
    )
  }

  /**
   * response 拦截器
   * @private
   */
  private responseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data }: { data: AxiosResponse['data'] } = response

        if (data.statusCode === 200 || data.statusCode === 201) {
          return data.data
        } else {
          if (data.statusCode === 413 || data.statusCode === 401) {
            message.error('无效的会话，或者登录已过期，请重新登录。')
            // const userStore = useUserStore()
            // userStore.$patch({
            //   TOKEN: undefined,
            //   NAME: undefined,
            //   ACCOUNT: undefined,
            //   AVATAR: undefined,
            // })

            router.replace('/login')
          } else {
            message.error(data.msg || 'Error')
          }
          return Promise.reject(new Error(data.statusCode))
        }
      },
      (error: any) => {
        message.error(error.message)
        return Promise.reject(error)
      },
    )
  }
}

export default new Requests({})
