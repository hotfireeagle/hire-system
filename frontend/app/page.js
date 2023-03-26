import styles from "./page.module.css"
import Test from "@/components/test"

async function fetchTest() {
  return fetch("http://localhost:3000/api/hello").then(res => res.json())
}

async function fetchDetail() {
  return fetch("http://localhost:3000/api/detail/23232").then(res => res.json())
}

export default async function Home() {
  const parallPromise = Promise.all([fetchTest(), fetchDetail()])
  const [d1, d2] = await parallPromise
  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <h1>{JSON.stringify(d1)}</h1>
      <h1 style={{ color: "red" }}>{JSON.stringify(d2)}</h1>
      <Test />
    </div>
  )
}