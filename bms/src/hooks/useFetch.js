import { useState, useEffect } from "react"
import request from "@/utils/request"

export const useFetch = (defaultVal, url, params={}, method="post") => {
  const [data, setData] = useState(defaultVal || {})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    request(url, params, method).then(res => {
      setData(res)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return [loading, data]
}
