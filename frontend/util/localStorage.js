const prefix = "fe_question_"

export const getToken = () => {
  return localStorage.getItem(`${prefix}token`)
}

export const setToken = token => {
  localStorage.setItem(`${prefix}token`, token)
}

export const removeToken = () => {
  localStorage.removeItem(`${prefix}token`)
}