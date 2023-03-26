const sleep = t => new Promise(s => {
  setTimeout(s, t)
})
export async function GET(request) {
  await sleep(3000)
  console.log('----------- run me -----------')
  return Response.json({ name: "that is cool", now: Date.now() })
}

