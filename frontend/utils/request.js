const host = "http://127.0.0.1:8081/api/web"

const err = 0

export const get = url => {
  const apiPath = host + url
  return fetch(apiPath).then(response => {
    return response.json()
  }).then(obj => {
    if (obj.code === err) {
      return Promise.reject(obj.msg)
    } else {
      return obj.data
    }
  })
}

export const post = (url, postData) => {
  const apiPath = host + url
  return fetch(apiPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  }).then(response => {
    return response.json()
  }).then(data => {
    return data
  })
}