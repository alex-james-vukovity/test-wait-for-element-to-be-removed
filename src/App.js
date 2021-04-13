import React, { memo } from "react"
import { useQueries, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { ErrorBoundary } from "react-error-boundary"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export const App = () => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <QueryClientProvider client={queryClient}>
        <Fetch />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
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

  const [
    { isLoading: isLoadingPosts, data: posts },
    { isLoading: isLoadingTodos, data: todos },
  ] = useQueries([
    { queryKey: "posts", queryFn },
    { queryKey: "todos", queryFn },
  ])

  if (isLoadingPosts || isLoadingTodos) {
    return (
      <>
        <div role="spinbutton">Loading...</div>
        <div role="spinbutton">Loading...</div>
        <div role="spinbutton">Loading...</div>
      </>
    )
  }

  return (
    <main>
      <h1>Title</h1>
      <Data data={posts} />
      <Data data={todos} />
    </main>
  )
}
