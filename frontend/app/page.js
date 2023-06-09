import { get } from "@/util/request"
import Carousel from "@/component/carousel"
import styles from "./page.module.css"

export default async function Home() {
  const banners = await get("/bannerList") // banner列表
  const categorys = await get("/recommendCategory") // 热门搜索分类列表

  return (
    <div className={styles.pageContainer}>
      <Carousel imgs={banners} />
    </div>
  )
}