const keyWrapper = key => "hire_system" + key

const put = (key, value) => {
  localStorage.setItem(keyWrapper(key), value)
}

const get = key => {
  const keyAfterWrapper = keyWrapper(key)
  return localStorage.getItem(keyAfterWrapper)
}

const remove = key => {
  const k2 = keyWrapper(key)
  localStorage.removeItem(k2)
}

export const tokenDB = {
  put: token => put("token", token),
  get: () => get("token"),
  remove: () => remove("token"),
}