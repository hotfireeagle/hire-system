"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      { children }
    </QueryClientProvider>
  )
}