import { Skeleton, Stack } from "@chakra-ui/react"
import React from "react"

import { Card, CardContent, CardFooter, CardProps } from "~/components"

interface SkeletonCardProps extends CardProps {}

export default function SkeletonCard(props: SkeletonCardProps) {
  return (
    <Card {...props}>
      <CardContent>
        <Stack mb="12">
          <Skeleton height="6" maxW="3xs" rounded="full" />
          <Skeleton height="6" maxW="sm" rounded="full" />
        </Stack>
      </CardContent>
      <CardFooter>
        <Skeleton height="6" w="64px" rounded="full" />
      </CardFooter>
    </Card>
  )
}
