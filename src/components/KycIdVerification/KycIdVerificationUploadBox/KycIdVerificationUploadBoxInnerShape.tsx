import { Box, useBreakpointValue } from "@chakra-ui/react"

export enum KYC_UPLOAD_INNER_SHAPE {
  none = "none",
  default = "default",
  document = "document",
  oval = "oval",
}

type KycIdVerificationUploadBoxInnerShapeProps = {
  type: KYC_UPLOAD_INNER_SHAPE
}

const KycIdVerificationUploadBoxInnerShape = ({
  type = KYC_UPLOAD_INNER_SHAPE.none,
}: KycIdVerificationUploadBoxInnerShapeProps) => {
  const isMobileView = useBreakpointValue({ base: true, md: false })
  const mobileStyles = {
    transform: "rotate(90deg)",
  }
  if (!type || type === KYC_UPLOAD_INNER_SHAPE.none) return null

  if (type === KYC_UPLOAD_INNER_SHAPE.document) {
    return (
      <Box
        w="100%"
        h="100%"
        alt="placeholder"
        backgroundSize="contain"
        bgRepeat="no-repeat"
        bgPosition="center"
        bgImage="url('/images/camera-placeholder.svg')"
        {...(isMobileView && mobileStyles)}
      />
    )
  }

  if (type === KYC_UPLOAD_INNER_SHAPE.default) {
    return (
      <Box
        w="100%"
        h="190px"
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius="10px"
        backgroundColor="transparent"
        maxW="300px"
        bgPosition="center"
        mx={10}
        {...(isMobileView && mobileStyles)}
      />
    )
  }

  if (type === KYC_UPLOAD_INNER_SHAPE.oval) {
    return (
      <Box
        w="180px"
        h="220px"
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius="50%"
        backgroundColor="transparent"
        bgPosition="center"
      />
    )
  }

  return null
}

export default KycIdVerificationUploadBoxInnerShape
