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

export function converTimeForApi(postData, startTimeKey, endTimeKey, timesKey="times") {
  const timesArr = postData?.[timesKey] || []
  postData[startTimeKey] = timesArr[0].format("YYYY-MM-DDT00:00:00Z")
  postData[endTimeKey] = timesArr[1].format("YYYY-MM-DDT23:59:59Z")
  delete postData[timesKey]
}