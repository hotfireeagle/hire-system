"use client"
import { get } from "@/util/request"
import { useQuery } from "@tanstack/react-query"
import styles from "./index.module.css"

const HomeToufu = () => {
  const { isLoading, error, data:homeTouFuList=[] } = useQuery({
    queryKey: ["homeToufuList"],
    queryFn: () => get("/homeToufuList"),
  })

  const base = "http://localhost:8081" // FIXME: change to backend care

  const leftImgSrc = base + homeTouFuList?.[0]?.url
  const rightTopImgSrc = base + homeTouFuList?.[1]?.url
  const rightBottomImgSrc = base + homeTouFuList?.[2]?.url

  return (
    <div className={styles.toufuWrapper}>
      <img src={leftImgSrc} className={styles.leftcls} />
      <div className={styles.rightpart}>
        <img src={rightTopImgSrc} className={styles.rt} />
        <img src={rightBottomImgSrc} className={styles.rb} />
      </div>
    </div>
  )
}

export default HomeToufu