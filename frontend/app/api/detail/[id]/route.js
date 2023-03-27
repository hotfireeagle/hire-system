import { sleep } from "@/utils"

export async function GET(request) {
  await sleep(6000)
  console.log('----------- run he -----------')
  return Response.json({ name: "nextjs is powerful", now: Date.now() })
}
