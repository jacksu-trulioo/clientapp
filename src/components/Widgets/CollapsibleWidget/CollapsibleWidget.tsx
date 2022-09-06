import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react"
import { ReactElement } from "react"

type CollapsibleWidgetProps = {
  themeColor?: string
  value?: string
  title: string
  content: ReactElement
}

const CollapsibleWidget = ({
  themeColor = "gray.400",
  value,
  title,
  content,
}: CollapsibleWidgetProps) => {
  if (!title || !content) return null

  return (
    <Accordion allowToggle>
      <AccordionItem mb={0}>
        <AccordionButton p={0}>
          <Flex py={6} px={4} alignItems="center" flex={1}>
            <Flex alignItems="center" flex={1}>
              <Box
                w={4}
                h={4}
                backgroundColor={themeColor}
                borderRadius="50%"
                marginEnd={3}
                transform="translateY(-1px)"
              />
              <Text as="h2" fontWeight={700} fontSize="sm">
                {title}
              </Text>
            </Flex>
            {value && (
              <Text mx={4} fontSize="sm">
                {value}
              </Text>
            )}
            <AccordionIcon />
          </Flex>
        </AccordionButton>
        <AccordionPanel
          color={themeColor}
          fontSize="sm"
          px="44px"
          pt={0}
          pb={5}
        >
          {content}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default CollapsibleWidget
