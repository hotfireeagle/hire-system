import request from "./request"
import { history } from "@umijs/max"

const loginPath = "/user/login"

export async function fetchUserInfo() {
  let userDetail = []
  try {
    userDetail = await request("/user/detail", {}, "get")
  } catch (err) {
    if (!location.pathname.includes(loginPath)) {
      history.push(loginPath)
    }
  }
  return userDetail
}