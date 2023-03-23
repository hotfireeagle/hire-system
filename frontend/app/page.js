import styles from "./page.module.css"
import Test from "@/components/test"

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Test />
    </div>
  )
}