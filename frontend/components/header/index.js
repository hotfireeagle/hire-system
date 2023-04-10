import styles from "./index.module.css"
import DetailOrLogin from "./components/detailOrLogin"

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={`${styles.itemCls} ${styles.mr60}`}>
        <span className={styles.logoSpanCls}>BIG</span>
        <span className={`${styles.logoSpanCls} ${styles.black}`}>.</span>
        <span className={`${styles.logoSpanCls} ${styles.black}`}>FE</span>
      </div>

      <div className={styles.itemCls}>
        <div className={`${styles.subTitleCls} ${styles.subMr}`}>Practice</div>
      </div>

      <div className={styles.itemCls}>
        <div className={`${styles.subTitleCls} ${styles.subMr}`}>Prepare</div>
      </div>

      <div className={styles.itemCls}>
        <div className={styles.subTitleCls}>Lists</div>
      </div>

      <div className={styles.itemCls}>
        <div className={styles.subTitleCls}>Discuss</div>
      </div>

      <div className={styles.flexgrow}></div>

      <div className={`${styles.itemCls} ${styles.mr0}`}>
        <DetailOrLogin />
      </div>
    </div>
  )
}