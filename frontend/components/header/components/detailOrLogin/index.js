"use client"
import { userApi } from "@/api/"
import { useQuery } from "@tanstack/react-query"

export default function DetailOrLogin() {
  const { isLoading, data } = useQuery({
    queryKey: ["userDetail"],
    queryFn: userApi.detail,
    refetchOnWindowFocus: false,
  })

  return (
    <div className={isLoading ? "animate-pulse" : ""}>
      { data?.email }
    </div>
  )
}