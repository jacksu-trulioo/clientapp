import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react"
import NextLink from "next/link"
import React from "react"

export type LinkProps = ChakraLinkProps & { isActive?: boolean; href?: string }

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { href = "/", children, ...rest } = props

    return (
      <NextLink href={href} passHref>
        <ChakraLink ref={ref} {...rest}>
          {children}
        </ChakraLink>
      </NextLink>
    )
  },
)

export default Link
