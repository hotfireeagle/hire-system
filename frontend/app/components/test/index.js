"use client"
import { useQuery } from "react-query"

export default function() {
  const query = useQuery("test", () => fetch("/api").then(res => res.json()))
  return <h1>{JSON.stringify(query)}</h1>
}