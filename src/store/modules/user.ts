import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store } from "@/store"
import { resetRouter } from '@/router'
import { LoginForm } from "@/api/auth/types"
import { login as loginApi, logout as logoutApi, getInfo as getInfoApi } from "@/api/auth"
import { getToken, removeToken, setToken } from "@/utils/auth"
import { UserInfo } from '@/api/system/user/types'

export const useUserStore = defineStore('user', () => {

  const token = ref<String>(getToken() ||'')
  // 角色集合
  const roles = ref<Array<string>>([])
  const permissions = ref<Array<string>>([])

  // 登录
  function login(loginForm: LoginForm) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginForm).then(response => {
        const getToken = response.data.token
        token.value = getToken
        setToken(getToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  // 登出
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi().then(() => {
        resetAuth()
        resetRouter()
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  // 获取信息
  function getInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getInfoApi().then(({ data }) => {
        roles.value = data.roles
        permissions.value = data.permissions
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  // 重置
  function resetAuth() {
    removeToken()
    token.value = ''
    roles.value = []
    permissions.value = []
  }

  return {
    token,
    roles,
    permissions,
    login,
    logout,
    getInfo
  }
})

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
