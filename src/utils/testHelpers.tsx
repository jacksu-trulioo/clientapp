import { render } from "@testing-library/react"
import React from "react"
import { SWRConfig } from "swr"

import { CustomChakraProvider } from "~/components"
import UserProvider from "~/hooks/useUser"

type UI = Parameters<typeof render>[0]

// see https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// UI-less passthrough fallback to prevent using conditional logic in render.
function ChildrenPassthrough({ children }: { children: React.ReactElement }) {
  return children
}

const Providers: typeof ChildrenPassthrough = ({ children }) => {
  return (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <CustomChakraProvider>
        <UserProvider>{children}</UserProvider>
      </CustomChakraProvider>
    </SWRConfig>
  )
}

const customRender = (ui: UI, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

// Re-export everything.
export * from "@testing-library/react"

// Override render method.
export { customRender as render }
