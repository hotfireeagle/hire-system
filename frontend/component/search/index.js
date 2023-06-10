"use client"
import styles from "./index.module.css"

// TODO: add logic

const Search = () => {
  return (
    <div className={styles.btnContainer}>
      <input className={styles.inputCls} />
      <button className={styles.searchBtn}>搜索</button>
    </div>
  )
}

export default Search