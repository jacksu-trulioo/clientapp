import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { Box, Container, FormControl, Input, Text } from "@chakra-ui/react"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect, useState } from "react"
import useSWR, { mutate } from "swr"

import {
  Accordian,
  ClientLayout,
  NoDataFound,
  PageContainer,
  SearchIcon,
  SkeletonCard,
} from "~/components"
import { useUser } from "~/hooks/useUser"
import { sortGlossaryDataWithSingleAplhabet } from "~/services/mytfo/clientTypes"
import { screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

export default function Glossary() {
  const { t } = useTranslation("glossary")
  const [searchTerm, setSearchTerm] = useState<string>()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)

  const { data: glossaries, error } =
    useSWR<sortGlossaryDataWithSingleAplhabet>(
      `/api/client/miscellaneous/glossaries?term=${
        searchTerm ? searchTerm : "all"
      }`,
      {
        revalidateOnFocus: false,
      },
    )

  const isLoading = !glossaries && !error
  const { user } = useUser()
  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Glossary",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const onChangerHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value
    await mutate(
      `/api/client/miscellaneous/glossaries?term=${
        e.target?.value ? e.target?.value : "all"
      }`,
    )
    setSearchTerm(value)
  }

  return (
    <Fragment>
      <ClientLayout
        title={t("page.title")}
        description={t("page.description")}
        footerRequired={false}
      >
        <PageContainer
          isLoading={isPageLoading}
          as="section"
          maxW="full"
          px="0"
          mt={{ base: 8, md: 8, lgp: 0 }}
          filter={isPageLoading ? "blur(3px)" : "none"}
        >
          <Box pt="12px">
            <Box fontStyle="normal" fontWeight="400" lineHeight="120%">
              <Text fontSize="30px" color="contrast.200" marginBottom="16px">
                {t("heading")}
              </Text>
              <Text fontSize="18px" color="gray.400" marginTop="8px">
                {t("description")}
              </Text>
            </Box>
            <Box
              display="flex"
              marginTop="48px"
              alignItems="center"
              justifyContent="center"
              borderBottom="1px solid #222"
              pb="16px"
            >
              <SearchIcon width="9" height="9" color="gray.400" />
              <FormControl
                display="block"
                width="100%"
                line-height="1.5"
                border-radius="0.25rem"
                transition="border-color .15s ease-in-out,box-shadow .15s ease-in-out"
              >
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={onChangerHandler}
                  placeholder={t("searchInput.placeHolder")}
                  background="none !important"
                  border="none !important"
                  color="contrast.200 !important"
                  fontSize="22px !important"
                  fontStyle="normal"
                  fontWeight="400"
                  _placeholder={{ color: "gray.700" }}
                />
              </FormControl>
            </Box>
            {isLoading ? (
              <SkeletonCard flex="1" mb="25px" mt="20px" />
            ) : (
              <Box pt="48px">
                {glossaries?.length
                  ? glossaries?.map(({ alphabet, record }, i) => (
                      <Container
                        display="flex"
                        flexDirection="column"
                        padding="0"
                        margin="0"
                        width="100%"
                        style={{ maxWidth: "100%" }}
                        key={i}
                      >
                        <Box
                          font-style="normal"
                          fontWeight="400"
                          fontSize="20px"
                          lineHeight="120%"
                          color="#b99855"
                          padding="8px 16px"
                          background="#1a1a1a"
                          margin="8px 0"
                        >
                          {alphabet}
                        </Box>
                        <Accordian accordianItem={record} />
                      </Container>
                    ))
                  : false}
                {(glossaries?.length == 0 || !glossaries) && (
                  <Box>
                    <NoDataFound isDescription isHeader isIcon />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </PageContainer>
      </ClientLayout>
    </Fragment>
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
