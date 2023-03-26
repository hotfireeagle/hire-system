export async function GET(request) {
  console.log('----------- run he -----------')
  return Response.json({ name: "nextjs is powerful", now: Date.now() })
}
