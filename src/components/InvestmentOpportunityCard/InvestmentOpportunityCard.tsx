import { Button } from "@chakra-ui/button"
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { chakra, Divider, Tag, Tooltip } from "@chakra-ui/react"
import NextImage from "next/image"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import {
  Card,
  CardContent,
  InfoIcon,
  IslamIcon,
  Link,
  LockIcon,
} from "~/components"
import {
  AllocationCategory,
  Opportunity,
  OpportunityCardVariant,
  UserQualificationStatus,
} from "~/services/mytfo/types"
import {
  viewSanitizedDeals,
  ViewSpecificOpportunityDetail,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"
import { logActivity } from "~/utils/logActivity"

interface InvestmentOpportunityCardProps {
  variant: OpportunityCardVariant
  status: UserQualificationStatus
  data: Opportunity
  hasOverlay?: boolean
}

function getAllocationColorIdentifier(categorization: string) {
  switch (categorization) {
    case AllocationCategory.CapitalYielding:
    case "تحقيق عوائد ماليّة":
      return "lightSlateGrey.800"
    case AllocationCategory.CapitalGrowth:
    case "نموّ رأس المال":
      return "shinyShamrock.700"
    case AllocationCategory.Opportunistic:
    case "انتهازيّة":
      return "cyberGrape.500"
    case AllocationCategory.AbsoluteReturn:
    case "عوائد مطلقة":
      return "darkLava.500"
  }
}

const InvestmentOpportunityCard = (props: InvestmentOpportunityCardProps) => {
  const { t } = useTranslation("opportunities")
  const { data, status, variant, hasOverlay, ...rest } = props

  const isMobileView = useBreakpointValue({ base: true, md: false })
  const router = useRouter()

  const renderOverlay = () => {
    return (
      <Box
        id="cardOverlay"
        display="none"
        h="full"
        w="full"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(27, 33, 35, 0.9)"
        transition="dissolve 0s ease-out 0.3s"
      >
        <VStack
          justifyContent="center"
          alignItems="center"
          h="full"
          spacing={4}
          textAlign="center"
          p={4}
        >
          <Text fontSize="lg" fontWeight="400" p={4} mx={4}>
            {t("overlay.description")}
          </Text>
          <Button
            colorScheme="primary"
            size="md"
            fontSize="sm"
            fontWeight="bold"
            onClick={() => {
              event({
                ...viewSanitizedDeals,
                label: `View Details ${data?.id}`,
                action: `View Details ${data?.id}`,
                category: `View Details ${data?.id}`,
              })
              router.push("/opportunities/unlock")
            }}
          >
            {t("overlay.cta")}
          </Button>
        </VStack>
      </Box>
    )
  }

  const RenderToolTip = ({ label }: { label: string }) => {
    return (
      <Tooltip hasArrow label={label} cursor="pointer" textAlign="center">
        <chakra.span>
          <InfoIcon
            aria-label="Info icon"
            color="primary.500"
            h={3.5}
            width={3.5}
            ml={1}
          />
        </chakra.span>
      </Tooltip>
    )
  }

  const renderCardContent = () => {
    return (
      <Box>
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {data?.titleSanitized &&
            (status === UserQualificationStatus.Verified ||
              status === UserQualificationStatus.ActivePipeline ||
              status === UserQualificationStatus.AlreadyClient) && (
              <Text
                aria-label="sanitizedTitle"
                color="gray.400"
                noOfLines={1}
                fontSize="10px"
                mb="2px"
              >
                {data?.titleSanitized}
              </Text>
            )}
          <HStack mb="2">
            <Text aria-label="title" color="white" noOfLines={1}>
              {data.title}
            </Text>
            {data.isShariahCompliant && (
              <IslamIcon w="3" h="3" color="secondary.500" alignSelf="center" />
            )}
          </HStack>
          <HStack w="full" fontSize="xs" mb={2}>
            <Text color="gray.500">
              {t("index.card.labels.assetClass")}
              {":"}
            </Text>
            <Text fontWeight="600">{data.assetClass}</Text>
          </HStack>
        </Flex>
      </Box>
    )
  }

  const renderOpportunityBreakdown = () => {
    return (
      <Box mb={3}>
        <Divider />
        <Flex direction="row" gridColumnGap="3" py="2">
          <VStack flex="1" alignItems="flex-start" spacing="6px">
            <Text fontSize="xs" color="gray.400">
              {t(
                `index.card.labels.${
                  data.isOpportunityClosed ? "netIRR" : "expectedReturn"
                }`,
              )}
              {!data.isOpportunityClosed ? (
                <RenderToolTip label={t("index.card.tooltip.expectedReturn")} />
              ) : (
                false
              )}
            </Text>

            {data.expectedReturn ? (
              <Text fontSize="sm" color="white">
                {variant === "detailed"
                  ? `${data.expectedReturn.split(" /")[0]}`
                  : `${data.expectedReturn.split(" /")[0]}...`}
              </Text>
            ) : (
              <HStack alignContent="center" color="primary.500">
                <Text fontSize="sm">
                  {t(
                    status === UserQualificationStatus.PendingApproval
                      ? "index.text.unlocking"
                      : "index.text.confidential",
                  )}
                </Text>
                <LockIcon />
              </HStack>
            )}
          </VStack>
          <Box>
            <Divider orientation="vertical" />
          </Box>
          <VStack flex="1" align="flex-start" spacing="6px">
            <Text fontSize="xs" color="gray.400">
              {t(
                `index.card.labels.${
                  data.isOpportunityClosed ? "exitDate" : "expectedExit"
                }`,
              )}
            </Text>
            <Text fontSize="sm" color="white" noOfLines={1}>
              {data.expectedExit}
            </Text>
          </VStack>
        </Flex>
        <Divider />
      </Box>
    )
  }

  const renderCardImage = () => {
    return (
      <Box position="relative">
        <NextImage
          src={data.image}
          alt={data.title}
          layout="responsive"
          objectFit="cover"
          height="124px"
          width="288px"
        />
        <Flex
          top={2}
          ml={2}
          position="absolute"
          flexWrap="wrap"
          alignItems="flex-start"
        >
          {!data.isOpportunityClosed && data?.isNewOpportunity && (
            <Tag bgColor="primary.500" size="sm" mb={1} mr={2} fontWeight="600">
              {t("index.card.tag.new")}
            </Tag>
          )}
          {data?.strategy && (
            <Tag
              bgColor={getAllocationColorIdentifier(data?.strategy)}
              size="sm"
              mb={1}
              mr={2}
              fontWeight="600"
            >
              {data?.strategy}
            </Tag>
          )}
        </Flex>
      </Box>
    )
  }

  const renderCardFooter = () => {
    return (
      <>
        {!isMobileView && (
          <Text
            aria-label="description"
            color="gray.400"
            fontSize="sm"
            noOfLines={2}
            mb={4}
          >
            {data.description}
          </Text>
        )}
        {(status === UserQualificationStatus.Verified ||
          status === UserQualificationStatus.ActivePipeline ||
          status === UserQualificationStatus.AlreadyClient) && (
          <HStack w="full" fontSize="xs" mb="3">
            <Text color="gray.500">
              {t("index.card.labels.assetManager")}
              {":"}
            </Text>
            <Text fontWeight="600">{data.sponsor}</Text>
          </HStack>
        )}
        <HStack w="full" fontSize="xs">
          <Text color="gray.500">
            {t("index.card.labels.country")}
            {":"}
          </Text>
          <Text fontWeight="600">{data.country}</Text>
        </HStack>
        {status == UserQualificationStatus.PendingApproval && (
          <Button
            disabled
            variant={variant === "detailed" ? "outline" : "link"}
            colorScheme="primary"
            size="sm"
            isFullWidth
            color="gray.600"
            mt={variant === "detailed" ? 5 : 4}
          >
            {t("index.button.verifying")}
          </Button>
        )}

        {(status === UserQualificationStatus.Verified ||
          status === UserQualificationStatus.ActivePipeline ||
          status === UserQualificationStatus.AlreadyClient) && (
          <Button
            as={Link}
            href={`/opportunities/${data.id}`}
            onClick={() => {
              logActivity(
                "OpportunityClick",
                JSON.stringify({ opportunityId: data?.id }),
              )
              event({
                ...ViewSpecificOpportunityDetail,
                category: `View Details ${data?.id}`,
                action: `${data?.id}`,
                label: `View Details ${data?.id}`,
              })
            }}
            variant={variant === "detailed" ? "outline" : "link"}
            colorScheme="primary"
            size="sm"
            isFullWidth={variant === "detailed"}
            mt={variant === "detailed" ? 5 : 4}
            alignSelf="flex-start"
          >
            {t("index.button.viewDetails")}
          </Button>
        )}
      </>
    )
  }

  return (
    <Card
      aria-label="opportunityCard"
      className="reactour__investment_opportunity"
      {...(hasOverlay && {
        _hover: {
          "& #cardOverlay": {
            display: "block",
          },
          bg: "gunmetal.800",
          opacity: "0.9",
        },
      })}
      boxShadow="none"
      {...rest}
      minW="288px"
    >
      <CardContent p="0" h="full" display="flex" flexDirection="column">
        {renderCardImage()}
        <Box
          px="3"
          py="4"
          d="flex"
          justifyContent="space-between"
          flexDirection="column"
          flex="1"
        >
          {renderCardContent()}
          {variant === "detailed" && renderOpportunityBreakdown()}
          {renderCardFooter()}
        </Box>
      </CardContent>
      {hasOverlay && renderOverlay()}
    </Card>
  )
}

export default React.memo(InvestmentOpportunityCard)
