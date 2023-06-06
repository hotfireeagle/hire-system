import request from "./request"
import { history } from "@umijs/max"
import dayjs from "dayjs"

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

export function convertTimeForApi(postData, startTimeKey, endTimeKey, timesKey="times") {
  const timesArr = postData?.[timesKey] || []
  postData[startTimeKey] = timesArr[0].format("YYYY-MM-DDT00:00:00Z")
  postData[endTimeKey] = timesArr[1].format("YYYY-MM-DDT23:59:59Z")
  delete postData[timesKey]
}

export function convertApiTimeForUI(data, startTimeKey, endTimeKey, timesKey="times") {
  data[timesKey] = [
    dayjs(data[startTimeKey]),
    dayjs(data[endTimeKey]),
  ]
}

// 去掉timezone进行显示
export function convertTimeToShow(timestr) {
  const strarr = timestr.split("+")
  const time = strarr[0]
  const t2 = time.replace(/T/g, " ")
  return t2
}