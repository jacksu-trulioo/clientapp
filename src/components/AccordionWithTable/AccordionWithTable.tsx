import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react"

type AccordionWithTablesProps = {
  header?: React.ReactNode
  accordionButton?: React.ReactNode
  accordionPanel?: React.ReactNode
}

const AccordionWithTable = (
  props: React.PropsWithChildren<AccordionWithTablesProps>,
) => {
  const { header, accordionButton, accordionPanel } = props

  return (
    <Box>
      {header}
      <AccordionItem borderRadius="6px" overflow="hidden">
        <AccordionButton>
          {accordionButton}
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          p="14px 16px"
          borderBottomLeftRadius="6px"
          borderBottomRightRadius="6px"
          overflow="hidden"
          bgColor="gray.850"
        >
          {accordionPanel}
        </AccordionPanel>
      </AccordionItem>
    </Box>
  )
}

export default AccordionWithTable
