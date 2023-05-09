import { getToken } from "@/util/localStorage"
import { checkIsBrowser } from "@/util/"
import { toast } from "react-toastify"

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
      toast("请先登录", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      if (!location.pathname.includes("/login")) {
        // 非登录页面才跳转过去
        location.href = "/login"
      }
    }
    return Promise.reject(response)
  } else if (response.code == Err) {
    toast(response.msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    })
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