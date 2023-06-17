"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { get } from "@/util/request"
import HomeToufu from "@/component/homeToufu"
import styles from "./index.module.css"

const CategoryTree = () => {
  const { isLoading, error, data=[] } = useQuery({
    queryKey: ["categoryList"],
    queryFn: () => get("/categoryList"),
  })
  const [showExpand, setShowExpand] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const activeCategoryObj = data[activeIdx]
  return (
    <div className={styles.container}>
      <section
        className={styles.left}
        onMouseEnter={() => setShowExpand(true)}
        onMouseLeave={() => setShowExpand(false)}
      >
        {
          data.map((obj, idx) => {
            return (
              <div onMouseEnter={() => setActiveIdx(idx)} key={obj.id} className={styles.row}>
                <div className={styles.topTitle}>{obj.name}</div>
                <div className={styles.secondContainer}>
                  {
                    obj.children.slice(0, 3).map(obj => (
                      <span key={obj.id}>{obj.name}</span>
                    ))
                  }
                </div>
                <img className={styles.rightArrow} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAbZJREFUeF7tmL9OwzAQxs9e2BlZeQAehRWpDLDEKIOHPAEBsbPljyJ1RMz0EZjZ+xqVIoSl5FBQK2WoyNLz2fJ1rXS5+/n7vlysIPGfSnx+EACigMQJiAUSF4CEoFhALJA4AbFA4gKQt4BYQCyQOAGxQOICkLeAWMCHBZqmuUTETwA4A4BXY8yzUgp9PHvpGV4UUNf1g1KqOjSDiBvn3Mpau1tqkPp/LwCqqrrTWq/nwyDidhzH6zzPt9RD/lefDcDUFCLutNarLMs2XBBYAeyHnrKgzLLsiSMXQgDwx4ErF4IBsIfgPReCAsCRC8EBmOeCMaakDsdQARzmfu/7/r4oim8qEKEDmOYujTGPAoCIQNAKmLZF59yVtfaHaH4/n8PHVuGFgbwtR8EpwPd6HBQAjg+kYACkvAp78/ux3GFVgG+/BwWAw+9sANq2vUHEt9mV2Idz7jaZK7Gu686HYfgCgAsAeOG6/GBTANUWd4q6XkLwFI1S1RAAVGRjqSsKiOWkqPoUBVCRjaWuKCCWk6LqUxRARTaWuqKAWE6Kqk9RABXZWOqKAmI5Kao+RQFUZGOpm7wCfgE9u9NBECN5IQAAAABJRU5ErkJggg==" />
              </div>
            )
          })
        }
      </section>

      <div
        className={styles.gap}
        onMouseEnter={() => setShowExpand(true)}
        onMouseLeave={() => setShowExpand(false)}
      />

      {
        activeCategoryObj && showExpand ? (
          <div
            className={styles.right}
            onMouseEnter={() => setShowExpand(true)}
            onMouseLeave={() => setShowExpand(false)}
          >
            <div className={styles.topname}>{activeCategoryObj.name}</div>
            {
              activeCategoryObj.children.map(cateObj => (
                <div className={styles.fullItem} key={cateObj.id}>
                  <div className={styles.secondName}>{cateObj.name}</div>
                  <div className={styles.textContainer}>
                    {
                      cateObj.children.map(cobj => (
                        <span className={styles.last} key={cobj.id}>{cobj.name}</span>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <div
            className={`${styles.right} ${styles.right2}`}
          >
            <HomeToufu />
          </div>
        )
      }
    </div>
  )
}

export default CategoryTree