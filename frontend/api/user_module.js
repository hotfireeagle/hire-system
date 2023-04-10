import {
  get,
  post,
} from "./tool"

export const userApi = {
  login: function(data) {
    return post("/user/login", data)
  },

  register: function(data) {
    return post("/user/register", data)
  },

  detail: function() {
    return get("/user/detail")
  }
}