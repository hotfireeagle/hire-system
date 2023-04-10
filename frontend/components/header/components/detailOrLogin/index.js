"use client"
import { userApi } from "@/api/"
import { useQuery } from "@tanstack/react-query"

export default function DetailOrLogin() {
  const { isLoading, data } = useQuery({
    queryKey: ["userDetail"],
    queryFn: userApi.detail,
  })

  return (
    <div className={isLoading ? "animate-pulse" : ""}>
      {JSON.stringify(data)}
    </div>
  )
}