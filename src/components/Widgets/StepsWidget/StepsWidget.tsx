import { Box, Flex, Grid, IconButton, Text } from "@chakra-ui/react"
import { Fragment, useCallback, useState } from "react"

import CloseIcon from "~/components/Icon/CloseIcon"
import StepsWidgetItem, {
  StepsWidgetItemProps,
} from "~/components/Widgets/StepsWidget/StepsWidgetItem"
import StepsWidgetSeparator from "~/components/Widgets/StepsWidget/StepsWidgetSeparator"

type StepsWidgetProps = {
  title: string
  items: StepsWidgetItemProps[]
}

const StepsWidget = ({ title, items = [] }: StepsWidgetProps) => {
  const [visible, setVisible] = useState(true)

  const handleClose = useCallback(() => {
    setVisible((prevValue) => !prevValue)
  }, [])

  if (!items || !items?.length || !visible) return null

  return (
    <Box
      backgroundColor="gray.800"
      paddingStart={5}
      paddingEnd={1}
      pt={1}
      pb={4}
    >
      <Flex justifyContent="space-between" alignItems="center" pb={2}>
        <Text color="gray.600" as="h2" fontSize="sm">
          {title}
        </Text>
        <IconButton
          variant="ghost"
          aria-label="close"
          icon={<CloseIcon />}
          onClick={handleClose}
          color="primary.500"
        />
      </Flex>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(5, 1fr)"]}
        alignItems="center"
        justifyContent="center"
        marginEnd={4}
      >
        {items.map((item, index) => {
          return (
            <Fragment key={index}>
              <StepsWidgetItem {...item} />
              {index < items.length - 1 && <StepsWidgetSeparator />}
            </Fragment>
          )
        })}
      </Grid>
    </Box>
  )
}

export default StepsWidget
