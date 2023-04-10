import { getToken } from "@/util/localStorage"
import { message } from "antd"
import Router from "next/router"

const base = "http://localhost:8080/api"

const Err = 0
const NeedLogin = 2

/**
 * 统一的结果处理方法
 * @param {*} response 
 * @returns 
 */
const responsePipeline = response => {
  console.log("response is >>>", response)
  if (response.code == NeedLogin) {
    Router.push("/login")
    return Promise.reject(response)
  } else if (response.code == Err) {
    message.warning(response.msg)
    return Promise.reject(response)
  } else {
    return response.data
  }
}

export function get(api) {
  return fetch(`${base}${api}`, {
    method: "GET",
    headers: {
      token: getToken(),
    },
  }).then(res => {
    return res.json()
  }).then(responsePipeline)
}

export function post(api, postData) {
  return fetch(`${base}${api}`, {
    method: "POST",
    headers: {
      token: getToken(),
    },
    body: JSON.stringify(postData),
  }).then(res => {
    return res.json()
  }).then(responsePipeline)
}