import { QueryClientProvider } from "react-query"
import { rest } from "msw"
import { setupServer } from "msw/node"
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"

import { App, queryClient } from "./App"

const response = [
  {
    id: 1,
    title: "...",
  },
]

const urlPosts = "https://jsonplaceholder.typicode.com/posts"

const server = setupServer()

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "warn",
  })
)
afterEach(() => {
  queryClient.clear()
  server.resetHandlers()
})
afterAll(() => server.close())

test("should render a heading", async () => {
  server.use(rest.get(urlPosts, (req, res, ctx) => res(ctx.json(response))))

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )

  await waitForElementToBeRemoved(await screen.findAllByTestId("abc"))

  const heading = screen.getByRole("heading", { name: "Title" })
  expect(heading).toBeInTheDocument()
})
