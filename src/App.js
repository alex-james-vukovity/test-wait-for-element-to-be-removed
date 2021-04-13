import React, { memo } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Fetch />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

const Data = memo(({ data }) => (
  <section>
    {data.map((post) => (
      <p key={post.id}>{post.title}</p>
    ))}
  </section>
))

const Fetch = () => {
  const queryFn = async ({ queryKey }) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/${queryKey[0]}`
    )
    if (!response.ok) throw new Error("path wrong")
    return response.json()
  }

  const { isLoading, data } = useQuery("posts", queryFn)

  if (isLoading) {
    return (
      <>
        <div data-testid="abc">Loading...</div>
        <div data-testid="abc">Loading...</div>
        <div data-testid="abc">Loading...</div>
      </>
    )
  }

  return (
    <main>
      <h1>Title</h1>
      <Data data={data} />
    </main>
  )
}
