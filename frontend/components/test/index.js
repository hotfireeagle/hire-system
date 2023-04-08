"use client"
import { useQuery } from "react-query"

export default function() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["test"],
    queryFn: fetch("http://localhost:8080/api/user/list").then(res => {
      return res.json()
    })
  })

  if (isLoading) {
    return "Loading"
  }

  if (error) {
    return "err: " + error
  }

  return (
    <h1>{JSON.stringify(data)}</h1>
  )
}