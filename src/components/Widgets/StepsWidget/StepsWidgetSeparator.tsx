import { Box } from "@chakra-ui/react"

const StepsWidgetSeparator = () => {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      d={["none", "none", "flex"]}
      mx={2}
    >
      <Box w={0.5} h={1} mr={1} flexShrink={0} backgroundColor="primary.500" />
      <Box w={1} h={1} mr={1} flexShrink={0} backgroundColor="primary.500" />
      <Box w={1} h={1} mr={1} flexShrink={0} backgroundColor="primary.500" />
      <Box w={1} h={1} mr={1} flexShrink={0} backgroundColor="primary.500" />
      <Box w={0.5} h={1} flexShrink={0} backgroundColor="primary.500" />
    </Box>
  )
}

export default StepsWidgetSeparator
