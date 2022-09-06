import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Flex } from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"

import {
  ClientLayout,
  FolderCard,
  NoDataFound,
  PageContainer,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { DocCenterList } from "~/services/mytfo/types"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

export default function DashboardScreen() {
  const { t } = useTranslation("documentCenter")
  const [isSorting, setSorting] = useState(false)
  const [docCenterData, setDocCenterData] = useState<DocCenterList>()
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    getDocCenterData()
  }, [])

  const { user } = useUser()

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "My Documents Landing Page",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const getDocCenterData = async () => {
    setIsLoading(true)
    try {
      var response = await ky
        .post(`/api/client/documents/doc-center`, {
          json: {
            action: "list",
          },
        })
        .json<DocCenterList>()
      var docData = response
      setDocCenterData(docData)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const sortData = () => {
    if (isSorting) {
      docCenterData?.data.sort((a, b) => a.name.localeCompare(b.name))
      setSorting(false)
    } else {
      docCenterData?.data.sort((a, b) => b.name.localeCompare(a.name))
      setSorting(true)
    }
  }
  return (
    <ClientLayout title={t("page.title")} description={t("page.description")}>
      <PageContainer
        isLoading={isPageLoading}
        as="section"
        maxW="full"
        px="0"
        mt={{ base: 0, md: 0, lgp: 0 }}
        filter={isPageLoading ? "blur(3px)" : "none"}
      >
        {isLoading ? (
          <SkeletonCard flex="1" mb="25px" mt="20px" />
        ) : (
          <Box>
            <Box
              as="h1"
              fontSize="30px"
              fontWeight="400"
              lineHeight="120%"
              color="#fff"
              pb={{ base: "20px", md: "28px", lgp: "40px" }}
            >
              {t("heading")}
            </Box>
            {docCenterData?.data.length == 0 || !docCenterData?.data ? (
              <Box>
                <NoDataFound isDescription isHeader isIcon />
              </Box>
            ) : (
              <Box>
                <Box
                  fontSize="14px"
                  color="#c7c7c7"
                  ml="8px"
                  fontWeight="400"
                  mb={{ base: "20px", md: "20px", lgp: "24px" }}
                  lineHeight="120%"
                  onClick={() => sortData()}
                  cursor="pointer"
                  className="sortArea"
                >
                  {isSorting ? (
                    <Box as="span">
                      {t("labels.name")}
                      <Box aria-label="lower" role={"img"} as="span" ml="6px">
                        <svg
                          width="12"
                          height="7"
                          viewBox="0 0 12 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            display: "inline-block",
                            transform: "rotate(180deg)",
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M0.244293 5.56358L5.5927 0.17043C5.81784 -0.0568099 6.18158 -0.0568099 6.4073 0.17043L11.7557 5.56358C12.0814 5.89162 12.0814 6.42535 11.7557 6.75397C11.43 7.08201 10.9013 7.08201 10.5756 6.75397L5.99971 2.14042L1.42496 6.75397C1.09866 7.08201 0.570016 7.08201 0.244293 6.75397C-0.0814295 6.42535 -0.0814295 5.89162 0.244293 5.56358Z"
                            fill="#C7C7C7"
                          ></path>
                        </svg>
                      </Box>
                    </Box>
                  ) : (
                    <Box as="span">
                      {t("labels.name")}
                      <Box aria-label="upper" role={"img"} as="span" ml="6px">
                        <svg
                          width="12"
                          height="7"
                          viewBox="0 0 12 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "inline-block" }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M0.244293 5.56358L5.5927 0.17043C5.81784 -0.0568099 6.18158 -0.0568099 6.4073 0.17043L11.7557 5.56358C12.0814 5.89162 12.0814 6.42535 11.7557 6.75397C11.43 7.08201 10.9013 7.08201 10.5756 6.75397L5.99971 2.14042L1.42496 6.75397C1.09866 7.08201 0.570016 7.08201 0.244293 6.75397C-0.0814295 6.42535 -0.0814295 5.89162 0.244293 5.56358Z"
                            fill="#C7C7C7"
                          ></path>
                        </svg>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Flex
                    gridGap={{ base: "2%", md: "25px 20px", lgp: "25px 20px" }}
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    w="100%"
                  >
                    {docCenterData?.data.map((data, i) => (
                      <FolderCard
                        key={i}
                        counter={data.filecounts}
                        title={data.name}
                      />
                    ))}
                  </Flex>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </PageContainer>
    </ClientLayout>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId) {
      return {
        props: {}, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
