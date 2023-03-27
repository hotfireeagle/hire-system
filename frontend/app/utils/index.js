export const sleep = t => new Promise(s => {
  setTimeout(s, t)
})