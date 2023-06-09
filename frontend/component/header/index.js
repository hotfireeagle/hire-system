import styles from "./index.module.css"

const Header = () => {
  return (
    <header className={styles.headercls}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>拧螺丝招聘</a>
        <div className={styles.menuWrapper}>
          <a href="/">首页</a>
          <a href="/">职位</a>
          <a href="/">校园</a>
          <a href="/">海归</a>
          <a href="/">公司</a>
          <a href="/">APP</a>
          <a href="/">资讯</a>
          <a href="/">有了</a>
        </div>
        <div className={styles.flexg} />
        <div className={styles.rightBtnContainer}>
          <a href="/">上传简历</a>
          <a href="/">我要找工作</a>
          <a href="/">我要招聘</a>
          <a className={styles.logincls} href="/">登录/注册</a>
        </div>
      </div>
    </header>
  )
}

export default Header