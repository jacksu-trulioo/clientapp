import {
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"
import React from "react"
import ReactMarkdown, { Components } from "react-markdown"
import gfm from "remark-gfm"

type GetCoreProps = {
  children?: React.ReactNode
  "data-sourcepos"?: never
}

function getCoreProps(props: GetCoreProps): {} {
  return props["data-sourcepos"]
    ? { "data-sourcepos": props["data-sourcepos"] }
    : {}
}

const ChakraUIMarkDownRenderer = (props: { children: string }) => {
  const newTheme: Components = {
    p: (props) => {
      const { children } = props
      return (
        <Text color="gray.500" mb={2}>
          {children}
        </Text>
      )
    },
    a: (props) => {
      const { children, ...rest } = props
      return (
        <Link
          color="primary.500"
          target="_blank"
          textDecoration="underline"
          {...rest}
        >
          {children}
        </Link>
      )
    },
    ul: (props) => {
      const { ordered, children, depth } = props
      const attrs = getCoreProps(props)
      let Element = UnorderedList
      let styleType = "disc"
      if (ordered) {
        Element = OrderedList
        styleType = "decimal"
      }
      if (depth === 1) styleType = "circle"
      return (
        <Element
          spacing={2}
          as={ordered ? "ol" : "ul"}
          styleType={styleType}
          ps={4}
          {...attrs}
        >
          {children}
        </Element>
      )
    },
    ol: (props) => {
      const { ordered, children, depth } = props
      const attrs = getCoreProps(props)
      let Element = UnorderedList
      let styleType = "disc"
      if (ordered) {
        Element = OrderedList
        styleType = "decimal"
      }
      if (depth === 1) styleType = "circle"
      return (
        <Element
          spacing={2}
          as={ordered ? "ol" : "ul"}
          styleType={styleType}
          ps={4}
          {...attrs}
        >
          {children}
        </Element>
      )
    },
    li: (props) => {
      const { children, checked } = props
      return (
        <ListItem
          listStyleType={checked !== null ? "none" : "inherit"}
          color="gray.500"
        >
          {children}
        </ListItem>
      )
    },
  }
  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      components={ChakraUIRenderer(newTheme)}
      skipHtml
    >
      {props.children}
    </ReactMarkdown>
  )
}

export default ChakraUIMarkDownRenderer
