import { HttpEnum } from '@/enums/httpEnum'

const baseURL = 'http://localhost:8200'
const userStore = useUserStore()
interface Options {
  url: string
  method: any
  data?: any
  header?: any
  timeout?: number
}
export const request = (options: Options) => {
  const { url, method, data, timeout } = options
  let { header } = options
  if (!header) {
    header = {
      'content-type': 'application/json',
    }
    if (userStore.token)
      header.Authorization = userStore.token
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + url,
      method: method || 'GET',
      data,
      header,
      timeout,
      success: (res: any) => {
        if (HttpEnum.SUCCESS.includes(res.data.code)) {
          resolve(res.data.result)
        }
        else if (HttpEnum.ACCOUNT_ERROR.includes(res.data.code)) {
          uni.showToast({
            title: '账号密码错误',
            icon: 'none',
            duration: 2000,
          })
          reject(res.data)
        }
        else if (HttpEnum.TIMEOUT.includes(res.data.code)) {
          uni.showToast({
            title: '登录失效，请重新登录',
            icon: 'none',
            duration: 2000,
          })
          userStore.setToken('')
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res.data)
        }
        else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          })
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
