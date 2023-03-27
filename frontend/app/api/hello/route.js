import { sleep } from "@/app/utils"

export async function GET(request) {
  await sleep(1000)
  console.log('----------- run me -----------')
  return Response.json({ name: "that is cool", now: Date.now() })
}

