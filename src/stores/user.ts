import { acceptHMRUpdate, defineStore } from 'pinia'

export interface UserModule {
  token: string
  userInfo: Record<string, any>
}
export const useUserStore = defineStore('user', {
  state: (): UserModule => ({
    token: uni.getStorageSync(ACCESS_TOKEN),
    userInfo: uni.getStorageSync(USER_INFO),
  }),
  getters: {
    getToken: state => state.token,
    getUserInfo: state => state.userInfo,
  },
  actions: {
    setToken(token: string) {
      this.token = token
      if (token)
        uni.setStorageSync(ACCESS_TOKEN, token)
      else
        uni.removeStorageSync(ACCESS_TOKEN)
    },
    setUserInfo(userInfo: Record<string, any>) {
      if (userInfo) {
        this.userInfo = userInfo
        uni.setStorageSync(USER_INFO, userInfo)
      }
      else {
        this.userInfo = {}
        uni.removeStorageSync(USER_INFO)
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
