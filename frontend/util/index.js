/**
 * 判断是不是运行在浏览器环境
 * @returns
 */
export const checkIsBrowser = () => {
  if (typeof window === "object") {
    return true
  }
  return false
}