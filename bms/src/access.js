/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const permissionStrList = initialState?.userDetail?.permissions || []
  const obj = {}
  permissionStrList.forEach(v => obj[v] = true)
  return obj
}
