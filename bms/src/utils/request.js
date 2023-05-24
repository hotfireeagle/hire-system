import axios from "axios"
import { removeToken, getToken } from "./localStorage"

const client = axios.create({
  baseURL: "/api/ope",
  withCredentials: true,
  timeout: 60 * 1000,
})

client.interceptors.response.use((response) => {
  let res = response.data // 接口返回的最外层响应体

  const { code, msg, data } = res

  // 一些需要重新进行登录的code
  const needLoginCode = [2]

  if (needLoginCode.includes(code)) {
    const loginRoute = "/user/login"

    if (!window.location.pathname.includes(loginRoute)) {
      message.error(msg || "登录失败！请重新登录")
      history.replace(loginRoute)
      removeToken()
    }
    return Promise.reject(res)
  }

  const successCode = 1 // 成功的code

  if (code != successCode) {
    message.error(msg || "系统出现错误")
    return Promise.reject()
  } else {
    return data
  }
})

/**
 * 进行请求的处理方法
 * @param {*} url : api路径
 * @param {*} data : 请求数据
 * @param {*} method : 请求方法
 */
export default async function request(url, value = {}, method = "post", options = {}) {
  method = method.toLowerCase()
  let token = getToken()
  const headers = {
    token,
  }

  if (method === "post") {
    return client(url, {
      method: "post",
      data: value,
      headers,
      ...(options || {}),
    })
  } else if (method === "get") {
    return client(url, { params: value, headers }, options)
  } else if (method === "formdata") {
    return client({
      method: "post",
      url: url,
      data: value,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
    })
  }
}