import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react"
import { Fragment } from "react"

type Accordians = {
  accordianItem: accordianItems[]
}
type accordianItems = {
  term?: string
  definition?: string
}

const Accordian = ({ accordianItem }: Accordians) => {
  return (
    <Fragment>
      <Accordion allowToggle>
        {accordianItem?.map(({ term, definition }, i) => (
          <AccordionItem
            className="card"
            position="relative"
            display="flex !important"
            flexDirection="column"
            minWidth="100% !important"
            wordWrap="break-word !important"
            backgroundClip="border-box !important"
            borderRadius="0.25rem !important"
            color="#fff !important"
            overflow="hidden !important"
            margin="0 !important"
            key={i}
            // borderBottom="1px solid rgba(0,0,0,.125) !important"
            backgroundColor="rgba(0,0,0,.03) !important"
            borderTop="1px solid #222222"
            borderTopColor="gray.800"
            _first={{ borderTop: "0" }}
          >
            <AccordionButton
              className="btn-accord card-header"
              justifyContent="space-between"
              display="flex"
              p="24px 16px"
              bgColor="transparent"
              _hover={{
                bgColor: "transparent",
              }}
            >
              <Box flex="1" textAlign="left">
                {term}
              </Box>
              <AccordionIcon color="#B99855" w="24px" h="24px" />
            </AccordionButton>
            <AccordionPanel pb={4} backgroundColor="rgba(0,0,0,.03) !important">
              <Box
                fontStyle="normal"
                fontWeight="400"
                fontSize="20px"
                lineHeight="120%"
                color="#c7c7c7"
                flex="1 1 auto"
                backgroundColor="rgba(0,0,0,.03) !important"
              >
                {definition}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Fragment>
  )
}

export default Accordian
