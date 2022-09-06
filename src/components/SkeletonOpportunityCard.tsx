import { Stack } from "@chakra-ui/layout"
import { Skeleton, SkeletonCircle } from "@chakra-ui/react"
import React from "react"

import { Card, CardContent, CardProps } from "~/components"

interface SkeletonCardProps extends CardProps {}

export default function SkeletonOpportunityCard(props: SkeletonCardProps) {
  return (
    <Card {...props}>
      <CardContent>
        <Stack mt="1" mb="6" direction="row" alignItems="center">
          <SkeletonCircle size="10" />
        </Stack>
        <Stack mb="10">
          <Skeleton height="8" maxW="sm" rounded="full" />
          <Skeleton height="8" maxW="3xs" rounded="full" />
        </Stack>
        <Skeleton height="8" maxW="50%" rounded="full" />
      </CardContent>
    </Card>
  )
}
