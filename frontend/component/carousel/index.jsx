import styles from "./index.module.css"

const Carousel = props => {
  return (
    <div className={styles.imgWrapper}>
      <img src={props.imgs[0]?.url} />
    </div>
  )
}

export default Carousel