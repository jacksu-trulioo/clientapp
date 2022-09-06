import {
  Box,
  chakra,
  Container,
  Flex,
  HStack,
  HTMLChakraProps,
  Text,
} from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CloseIcon, SecurityLockIcon } from "~/components"

export interface ModifiedProposalByRmNotificationProps
  extends HTMLChakraProps<"header"> {
  onCloseClick: () => void
}

function ModifiedProposalByRmNotification(
  props: ModifiedProposalByRmNotificationProps,
) {
  const { t } = useTranslation("common")

  return (
    <Box
      maxW="full"
      w="auto"
      h={[12, 8]}
      mb={{ base: 4 }}
      bgColor="gray.850"
      zIndex="1"
      position="fixed"
      left="0"
      right="0"
      {...props}
    >
      <Container
        px={{ base: 4, md: 6, lg: 12, xl: 14 }}
        flex="1"
        maxW="5xl"
        h="full"
      >
        <Flex justifyContent="space-between" alignItems="center" h="full">
          <Box>
            <HStack>
              <SecurityLockIcon w="6" h="6" pt={1} color="secondary.500" />
              <Text fontSize="xs" fontWeight={400}>
                {t("modal.rmUpdate.description")}
                <chakra.span
                  onClick={() => {
                    props.onCloseClick()
                    router.push("/personalized-proposal")
                  }}
                  textDecoration="underline"
                  color="primary.500"
                  cursor="pointer"
                  px={1}
                >
                  {t("modal.rmUpdate.cta")}
                </chakra.span>
              </Text>
            </HStack>
          </Box>
          <Box onClick={props.onCloseClick} cursor="pointer">
            <CloseIcon boxSize={5} color="primary.500" />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default ModifiedProposalByRmNotification
