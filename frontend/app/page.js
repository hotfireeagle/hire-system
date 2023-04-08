import T2 from "@/components/test"
// import { Suspense } from "react"


async function fetchTest() {
  return fetch("http://localhost:3000/api/hello").then(res => res.json())
}

async function fetchDetail() {
  return fetch("http://localhost:3000/api/detail/23232").then(res => res.json())
}

export default async function Home() {
  return (
    <div>
      <T2 />
    </div>
  )
  // const d2 = fetchDetail()
  // const d1 = await fetchTest()

  // return (
  //   <div className={styles.container}>
  //     <h1 className="text-3xl font-bold underline">
  //       Hello world!
  //     </h1>
  //     <h1>{JSON.stringify(d1)}</h1>
  //     {/* <Test /> */}
  //     <Suspense fallback={<h1 style={{ color: "blue"}}>sssssss</h1>}>
  //       <T2 data={d2} />
  //     </Suspense>
  //   </div>
  // )
}