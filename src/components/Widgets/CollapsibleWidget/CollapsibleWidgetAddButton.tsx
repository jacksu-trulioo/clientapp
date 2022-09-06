import { Box, Button, ButtonProps, Text } from "@chakra-ui/react"

import PlusCircleIcon from "~/components/Icon/PlusCircleIcon"

type CollapsibleAddButtonWidgetProps = Pick<
  ButtonProps,
  "onClick" | "children"
> & {
  iconColor?: string
}

const CollapsibleWidgetAddButton = ({
  iconColor = "currentColor",
  children,
  onClick,
}: CollapsibleAddButtonWidgetProps) => {
  if (!children) return null

  return (
    <Button
      _hover={{ bg: "transparent" }}
      h="auto"
      w="fit-content"
      backgroundColor="transparent"
      outline={0}
      border={0}
      onClick={onClick}
      p={0}
    >
      <Box borderRadius="50%" backgroundColor="whiteAlpha.200" marginEnd={3}>
        <PlusCircleIcon opacity={0.5} color={iconColor} h="6" w="6" />
      </Box>
      <Text as="span" color="gray.600" fontSize="xs">
        {children}
      </Text>
    </Button>
  )
}

export default CollapsibleWidgetAddButton
