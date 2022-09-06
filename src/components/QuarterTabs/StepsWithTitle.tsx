import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
} from "@chakra-ui/react"
import React from "react"

type StepTitle = {
  Title: string
  Process: string
}

export default function StepsWithTitle({ Title, Process }: StepTitle) {
  return (
    <Flex alignItems="center">
      <Box position="relative">
        <CircularProgress
          thickness="2px"
          value={Number(Process)}
          color="primary.500"
        >
          <CircularProgressLabel fontSize="14px">
            {Process}%
          </CircularProgressLabel>
        </CircularProgress>
      </Box>
      <Flex justifyContent="center" flexDir="column">
        <Text fontSize="14px" fontWeight="400" pl="8px" color="#AAAAAA">
          {Title}
        </Text>
      </Flex>
    </Flex>
  )
}
