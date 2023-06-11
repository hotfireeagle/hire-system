"use client"
import { useQuery } from "@tanstack/react-query"
import { get } from "@/util/request"
import styles from "./index.module.css"

const CategoryTree = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["categoryList"],
    queryFn: () => get("/categoryList"),
  })

  console.log("data is >>>", data)

  return (
    <div className={styles.container}>
      <section className={styles.left}>

      </section>
    </div>
  )
}

export default CategoryTree