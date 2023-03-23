"use client"
import styles from "./index.module.css"

const Header = () => {
  const clickLogHandler = event => {
    event.preventDefault()
  }

  const jumpToBms = event => {
    event.preventDefault()
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoCls}>XXX</div>
      <div className={styles.rightContainer}>
        <a onClick={clickLogHandler} href="#" className={styles.logInCls}>Log in</a>
        <a onClick={jumpToBms} href="#" className={styles.jumpCls}>Go to Employer site</a>
      </div>
    </header>
  )
}

export default Header