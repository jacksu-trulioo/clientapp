import {
  Box,
  Flex,
  FlexProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { ReactElement, useMemo } from "react"

import KycIdVerificationUploadBoxInnerShape, {
  KYC_UPLOAD_INNER_SHAPE,
} from "~/components/KycIdVerification/KycIdVerificationUploadBox/KycIdVerificationUploadBoxInnerShape"

type KycIdVerificationUploadBoxProps = Pick<
  FlexProps,
  "children" | "display"
> & {
  innerShapeType?: KYC_UPLOAD_INNER_SHAPE
  title?: string
  footerComponent?: ReactElement
}

const KycIdVerificationUploadBox = ({
  innerShapeType = KYC_UPLOAD_INNER_SHAPE.none,
  title,
  children,
  footerComponent,
  ...rest
}: KycIdVerificationUploadBoxProps) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const innerComponent = useMemo(() => {
    if (children) return children

    return (
      <Flex
        borderWidth={1}
        borderColor="gray.700"
        backgroundColor="gray.850"
        justifyContent="center"
        alignItems="center"
        borderRadius={6}
        overflow="hidden"
        h={isMobileView ? 400 : 300}
        maxW="md"
        position="relative"
      >
        <KycIdVerificationUploadBoxInnerShape type={innerShapeType} />
      </Flex>
    )
  }, [children, innerShapeType, isMobileView])

  return (
    <Box w="100%" position="relative" {...rest}>
      {title && (
        <Text mb={9} fontSize="sm" color="gray.400">
          {title}
        </Text>
      )}
      {innerComponent}
      {footerComponent && (
        <Flex
          mt={4}
          alignItems="center"
          flexDirection={["column", "row"]}
          justifyContent={["center", "space-between"]}
        >
          {footerComponent}
        </Flex>
      )}
    </Box>
  )
}

export default KycIdVerificationUploadBox
