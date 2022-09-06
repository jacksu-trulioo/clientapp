import { Box, Divider, Flex, List, ListItem, Text } from "@chakra-ui/react"
import { ReactElement, useMemo } from "react"

type CollapsibleWidgetListContentItem = {
  icon?: ReactElement
  name: string
  value: string
}

type CollapsibleWidgetListContentProps = {
  items: CollapsibleWidgetListContentItem[]
  addComponent?: ReactElement
}

const CollapsibleWidgetListContent = ({
  items = [],
  addComponent,
}: CollapsibleWidgetListContentProps) => {
  const hasAddButton = useMemo(() => {
    return Boolean(addComponent)
  }, [addComponent])

  if (!items?.length) return null

  return (
    <>
      <List spacing={0}>
        {items.map((item, index) => (
          <ListItem key={index}>
            <Flex
              pt={index === 0 ? 0 : 5}
              pb={index < items.length - 1 || hasAddButton ? 5 : 0}
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
            >
              <Flex alignItems="center" flexGrow={1}>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  borderRadius="50%"
                  backgroundColor="whiteAlpha.200"
                  marginEnd={3}
                  w={6}
                  h={6}
                >
                  {item.icon}
                </Flex>
                <Text as="span" color="gray.600" fontSize="xs">
                  {item.name}
                </Text>
              </Flex>
              {item.value && (
                <Text mx={2} as="span" color="gray.600" fontSize="sm">
                  {item.value}
                </Text>
              )}
            </Flex>
            {(index < items.length - 1 || hasAddButton) && (
              <Divider borderColor="gray.600" opacity={0.2} />
            )}
          </ListItem>
        ))}
      </List>
      {hasAddButton && <Box mt={5}>{addComponent}</Box>}
    </>
  )
}

export default CollapsibleWidgetListContent
