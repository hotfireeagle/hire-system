"use client"
import { use, cache } from "react"
import { get } from "@/util/request"
import styles from "./index.module.css"

const CategoryTree = () => {
  const fetchCategoryList = () => get("/categoryList")
  const data = use(cache(fetchCategoryList)())

  console.log("data is >>>", data)

  return (
    <div className={styles.container}>
      <section className={styles.left}>

      </section>
    </div>
  )
}

export default CategoryTree