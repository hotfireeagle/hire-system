import { get } from "@/util/request"

export default async function Home() {
  const banners = await get("/bannerList") // banner列表
  const categorys = await get("/recommendCategory") // 热门搜索分类列表

  return (
    <div>
      {/* <img src={banners[0].url} /> */}
    </div>
  )
}