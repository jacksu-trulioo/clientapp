import { Flex, Text } from "@chakra-ui/react"
import { useMemo } from "react"

import CheckCircleAltIcon from "~/components/Icon/CheckCircleAltIcon"

export type StepsWidgetItemProps = {
  stepNumber: number
  text: string
  isCompleted?: boolean
  isActive?: boolean
  hasSeparator?: boolean
}

const StepsWidgetItem = ({
  text,
  stepNumber = 1,
  isCompleted = false,
  isActive = false,
}: StepsWidgetItemProps) => {
  const showStepNumber = useMemo(() => {
    return !isCompleted || isActive
  }, [isCompleted, isActive])

  const bgStepNumber = useMemo(() => {
    return isActive || isCompleted ? "primary.500" : "gray.600"
  }, [isActive, isCompleted])

  const textColor = useMemo(() => {
    return isCompleted || isActive ? "white.500" : "gray.600"
  }, [isActive, isCompleted])

  return (
    <Flex alignItems="center" mb={[3, 3, 0]}>
      {showStepNumber ? (
        <Flex
          w="30px"
          h="30px"
          justifyContent="center"
          alignItems="center"
          borderRadius="50%"
          flexShrink={0}
          backgroundColor={bgStepNumber}
        >
          <Text color="gray.850" fontSize="lg" lineHeight="18px">
            {stepNumber}
          </Text>
        </Flex>
      ) : (
        <CheckCircleAltIcon
          color="primary.500"
          w="30px"
          h="30px"
          flexShrink={0}
        />
      )}
      <Text as="span" marginStart={2.5} fontSize="sm" color={textColor}>
        {text}
      </Text>
    </Flex>
  )
}

export default StepsWidgetItem
