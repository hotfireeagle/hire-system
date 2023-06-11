import { get } from "@/util/request"
import Search from "@/component/search"
import CategoryTree from "@/component/categoryTree"
import styles from "./page.module.css"

export default async function Home() {
  const banners = await get("/bannerList") // banner列表, FIXME:
  const categorys = await get("/recommendCategory") // 热门搜索分类列表

  return (
    <div className={styles.pageContainer}>
      <div className={styles.henfuContainer}>
        <img className={styles.bannerCls} src={banners?.[0]?.url} />
      </div>

      <div className={styles.contentContainer}>
        <Search />

        <div className={styles.recommnedCategory}>
          <span className={styles.tips}>热门职位：</span>
          {
            categorys.map(cobj => (
              <span className={styles.tagCls} key={cobj.id}>{cobj.name}</span>
            ))
          }
        </div>

        <div className={styles.centerContainer}>
          <CategoryTree />
        </div>
      </div>
    </div>
  )
}