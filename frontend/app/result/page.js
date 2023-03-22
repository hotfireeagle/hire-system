import styles from "./index.module.css"

const SearchResult = () => {
  return (
    <div className={styles.pageContainer}>

    </div>
  )
}

export const generateMetadata = async props => {
  return {
    title: "detail page",
    description: "detail page for more content",
  }
}

export default SearchResult