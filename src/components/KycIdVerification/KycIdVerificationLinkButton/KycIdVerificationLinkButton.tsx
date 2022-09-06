import { Button, ButtonProps } from "@chakra-ui/button"
import { chakra, Flex, Text, Tooltip } from "@chakra-ui/react"
import React from "react"

import { InfoIcon } from "~/components"

type KycIdVerificationProps = Pick<
  ButtonProps,
  "children" | "size" | "onClick" | "isDisabled"
> & {
  orText?: string
  tooltipText?: string
}

const KycIdVerificationLinkButton = ({
  orText,
  tooltipText,
  children,
  size = "xs",
  onClick,
  isDisabled,
}: KycIdVerificationProps) => {
  const [isToolTipOpen, setTooltipOpen] = React.useState(false)
  return (
    <Flex alignItems="center">
      {orText && (
        <Text as="span" fontSize={size} color="gray.500" marginEnd={1}>
          {orText}
        </Text>
      )}
      <Button
        fontSize={size}
        variant="link"
        colorScheme="primary"
        onClick={onClick}
        marginEnd={tooltipText ? 1 : 0}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
      {tooltipText && (
        <Tooltip
          hasArrow
          label={tooltipText}
          placement="bottom"
          alignSelf="center"
          textAlign="center"
          isOpen={isToolTipOpen}
        >
          <chakra.span lineHeight="1">
            <InfoIcon
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              onClick={() => setTooltipOpen(!isToolTipOpen)}
              color="primary.500"
            />
          </chakra.span>
        </Tooltip>
      )}
    </Flex>
  )
}

export default KycIdVerificationLinkButton
