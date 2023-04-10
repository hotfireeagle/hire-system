import { getToken } from "@/util/localStorage"
import { checkIsBrowser } from "@/util/"

const base = "http://localhost:8081/api"

const Err = 0
const NeedLogin = 2

/**
 * 统一的结果处理方法
 * @param {*} response 
 * @returns 
 */
const responsePipeline = response => {
  if (response.code == NeedLogin) {
    if (checkIsBrowser()) {
      location.href = "/login"
    }
    return Promise.reject(response)
  } else if (response.code == Err) {
    return Promise.reject(response)
  } else {
    return response.data
  }
}

// 返回请求方法的header对象
function headerResolver() {
  const token = getToken()
  if (token) {
    return {
      token,
    }
  } else {
    return {}
  }
}

export function get(api) {
  return fetch(`${base}${api}`, {
    method: "GET",
    headers: headerResolver(),
  }).then(res => {
    return res.json()
  }).then(responsePipeline)
}

export function post(api, postData) {
  return fetch(`${base}${api}`, {
    method: "POST",
    headers: headerResolver(),
    body: JSON.stringify(postData),
  }).then(res => {
    return res.json()
  }).then(responsePipeline)
}