import { VStack } from "@chakra-ui/layout"
import { StackProps } from "@chakra-ui/react"
import React from "react"

type FormProps = Pick<StackProps, "children">

function Form({ children }: FormProps) {
  return <VStack spacing={["8", "6"]}>{children}</VStack>
}

export default Form
