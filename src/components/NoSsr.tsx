import dynamic from "next/dynamic"
import React from "react"

export const NoSsr: React.FC = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
)

// Also export a NoSSR Higher-Order component for situations where we need to access
// client side properties before rendering.
export const withNoSsr = function <T>(
  WrappedComponent: React.ComponentType<T>,
) {
  return dynamic(() => Promise.resolve(WrappedComponent), {
    ssr: false,
  })
}

export default dynamic(() => Promise.resolve(NoSsr), { ssr: false })
