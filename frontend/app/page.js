import { get } from "@/util/request"
import styles from "./page.module.css"

export default async function Home() {
  const banners = await get("/bannerList") // banner列表
  const categorys = await get("/recommendCategory") // 热门搜索分类列表

  return (
    <div className={styles.pageContainer}>
      <div className="slider">
        {/* {
          banners.map(bannerObj => (
            <img src={bannerObj.url} id={bannerObj.id} className="slider-item" />
          ))
        } */}
      </div>
      {/* <img src={banners[0].url} /> */}
    </div>
  )
}