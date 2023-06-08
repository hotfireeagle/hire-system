import { get } from "@/utils/request"

export default async function Home() {
  const banners = await get("/bannerList")

  return (
    <div>
      <img src={banners[0].url} />
    </div>
  )
}