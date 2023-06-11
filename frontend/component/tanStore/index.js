"use client"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

const queryClient = new QueryClient()

const TanStore = props => (
  <QueryClientProvider client={queryClient}>
    { props.children }
  </QueryClientProvider>
)

export default TanStore