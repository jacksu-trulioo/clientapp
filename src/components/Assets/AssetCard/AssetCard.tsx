import { Box, BoxProps, Flex, Text } from "@chakra-ui/react"
import React from "react"

import { Card, CardContent } from "~/components"
import PlusIcon from "~/components/Icon/PlusIcon"

export type AssetCardProps = BoxProps & {
  title: string
  description: string
  icon?: React.ReactNode
  ctaIcon?: React.ReactNode
  ctaPosition?: "start" | "center"
  onClick?: () => void
}

const Circle: React.FC = ({ children }) => {
  return (
    <Flex
      p={2}
      me={4}
      bg="opal.900"
      align="center"
      justify="center"
      rounded="full"
      data-testid="icon-container"
    >
      {children}
    </Flex>
  )
}

const DefaultCtaIcon = () => (
  <PlusIcon color="primary.500" h={6} w={6} data-testid="cta-container" />
)

const AssetCard: React.FC<AssetCardProps> = ({
  title,
  icon,
  description,
  ctaIcon = <DefaultCtaIcon />,
  ctaPosition = "start",
  onClick,
  ...props
}) => {
  return (
    <Card
      bg="gray.800"
      cursor="pointer"
      w="full"
      data-testid="asset-card"
      onClick={onClick}
      transition="0.3s ease"
      sx={{
        _hover: {
          transform: "scale(1.01)",
        },
      }}
      {...props}
    >
      <CardContent>
        <Flex justify="space-between">
          <Flex>
            {icon && (
              <Box>
                <Circle>{icon}</Circle>
              </Box>
            )}
            <Box pe={4}>
              <Text align="start" mb={4}>
                {title}
              </Text>
              <Text>{description}</Text>
            </Box>
          </Flex>
          <Flex justify="end" align={ctaPosition}>
            {ctaIcon}
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  )
}

AssetCard.displayName = "AssetCard"

export default AssetCard
