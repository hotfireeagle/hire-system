import { checkIsBrowser } from "./index"

const prefix = "fe_question_"

export const getToken = () => {
  if (checkIsBrowser()) {
    return localStorage.getItem(`${prefix}token`)
  }
}

export const setToken = token => {
  if (checkIsBrowser()) {
    localStorage.setItem(`${prefix}token`, token)
  }
}

export const removeToken = () => {
  if (checkIsBrowser()) {
    localStorage.removeItem(`${prefix}token`)
  }
}