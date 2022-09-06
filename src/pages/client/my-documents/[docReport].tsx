import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Hide,
  IconButton,
  Link,
  Show,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import useSWR from "swr"

import {
  ArrowDateIcon,
  Checkbox,
  ClientLayout,
  DownloadIcon,
  FeedbackModal,
  NoDataFound,
  PageContainer,
  Pagination,
  PdfModelBox,
  QuestionIcon,
  SkeletonCard,
  VideoModelBox,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import {
  DownloadDocs,
  FeedbackSubmissionScreen,
  ReportAndVideoList,
  ReportAndVideoObj,
} from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import {
  downloadDocument,
  screenSpentTime,
  viewDocument,
} from "~/utils/googleEventsClient"
import { clientEvent, clientUniEvent } from "~/utils/gtag"

const isMultiDownload = {
  name: "",
  date: "",
  contentType: "",
  size: "",
  length: "",
  fileWithPrefix: "",
  checked: false,
  type: "",
}

type ReportPorpsType = {
  folderName: string
}

export default function Report({ folderName }: ReportPorpsType) {
  const { user } = useUser()
  const { t, lang } = useTranslation("documentCenter")
  const isMobView = useMediaQuery([
    "(max-width: 768px)",
    "(display-mode: browser)",
  ])
  const [isViewPdf, setIsViewPdf] = useState(Boolean)
  const [IsViewVideo, setIsViewVideo] = useState(Boolean)
  const [isAllSelected, setAllSelected] = useState(false)
  const [viewURL, setViewURL] = useState<DownloadDocs["url"]>()

  const [docCenterReportData, setDocCenterReportData] =
    useState<ReportAndVideoList["data"]>()

  const [isPagination, setPagination] = useState(false)

  const [isSorting, setSorting] = useState(false)
  const [isSortingByFileName, setSortingByFileName] = useState(false)
  const [isCheckBoxShow, setCheckBoxShow] = useState(false)

  const [downloadShow, setdownloadShow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(0)
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()
  const [email, setEmail] = useState("")
  const pageLimit = 10

  const { data: profile } = useSWR(`/api/client/account/profile`, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  useEffect(() => {
    getDocReportData("desc", "fileName")
    setdownloadShow(false)
  }, [])

  useEffect(() => {
    setEmail(profile?.manager.email)
  }, [profile])

  useEffect(() => {
    if (isPagination) {
      getDocReportData("desc", "fileName")
      setdownloadShow(false)
    }
  }, [currentPage])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "List Of My Documents",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const getDocReportData = async (sortBy: string, sortType: string) => {
    var offset = currentPage * pageLimit - pageLimit
    setIsLoading(true)
    try {
      var response = await ky
        .post(
          `/api/client/documents/doc-center?max=${pageLimit}&offset=${offset}`,
          {
            json: {
              action: "list of files",
              folderName: folderName,
              orderBy: sortBy,
              sortBy: sortType,
            },
          },
        )
        .json<ReportAndVideoList>()
      var dataResponse = response //as ReportAndVideoList
      if (dataResponse?.success) {
        dataResponse.data.forEach((item) => {
          if (
            item.name.includes("pdf") ||
            item.name.includes("json") ||
            item.name.includes("pptx")
          ) {
            item.type = "pdf"
          }
          if (item.name.includes("mp4")) {
            item.type = "video"
          }
          item.checked = false
        })

        setDocCenterReportData(dataResponse?.data)
        setTotalPages(dataResponse.pageTotal as number)

        if ((dataResponse.pageTotal as number) > 1) {
          setPagination(true)
        } else {
          setPagination(false)
        }
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const selectAll = (checkName: string, isChecked: boolean) => {
    let isAllChecked = checkName === "All" && isChecked
    let isAllUnChecked = checkName === "All" && !isChecked
    const checked = isChecked
    const checkList = docCenterReportData?.map((item) => {
      if (isAllChecked || item.name === checkName) {
        return Object.assign({}, item, {
          checked,
        })
      } else if (isAllUnChecked) {
        return Object.assign({}, item, {
          checked: false,
        })
      }
      return item
    })
    checkID(checkList as ReportAndVideoList["data"])
    setDocCenterReportData(checkList)
    let isSelectedAll =
      checkList?.findIndex((item) => item?.checked === false) === -1 ||
      isAllChecked
    setAllSelected(isSelectedAll)
  }

  const fileDownloadView = async (
    callback: string,
    item: ReportAndVideoObj,
  ) => {
    setIsLoading(true)

    let params = {}

    var fileName: string[] = []
    if (callback == "multipleDownload") {
      docCenterReportData?.forEach((item) => {
        if (item.checked) {
          fileName.push(item.fileWithPrefix)
        }
      })

      if (fileName.length > 1) {
        params = {
          fileName: fileName,
          action: callback,
        }
      } else {
        params = {
          fileName: fileName[0],
          action: "download",
        }
      }
    } else {
      params = {
        fileName: item.fileWithPrefix,
        action: callback,
      }
    }

    var response = await ky
      .post(`/api/client/documents/doc-center`, {
        json: params,
        timeout: 20000,
      })
      .json<DownloadDocs>()
    var dataResponse = response as DownloadDocs

    if (dataResponse?.success) {
      if (callback == "view") {
        if (item.contentType.includes("mp4")) {
          setViewURL(dataResponse.url)
          setIsViewVideo(true)
        } else {
          setViewURL(dataResponse.url)
          setIsViewPdf(true)
        }
        clientUniEvent(
          viewDocument,
          folderName + "/" + item.name,
          user?.mandateId as string,
          user?.email as string,
        )
      } else {
        const url = dataResponse.url
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (iOS) {
          window.location.href = dataResponse.url as string
        } else {
          var a = document.createElement("a")
          a.href = url as string
          a.download = item
            ? item.name
            : "client" + new Date().getTime() + "_" + "document.zip"
          a.target = "_blank"
          a.click()
        }
        clientUniEvent(
          downloadDocument,
          folderName + "/" + item.name,
          user?.mandateId as string,
          user?.email as string,
        )
        if (
          getFeedbackCookieStatus(
            siteConfig.clientFeedbackSessionVariableName,
          ) == "true"
        ) {
          setTimeout(() => {
            onFeedbackModalOpen()
          }, 1000)
        }
      }
    }

    setIsLoading(false)
  }

  const sortData = async (orderBy: string, sortBy: string) => {
    await ky
      .post(`/api/client/documents/doc-center?max=${10}&offset=${0}`, {
        json: {
          action: "list of files",
          folderName: folderName,
          orderBy: orderBy,
          sortBy: sortBy,
        },
      })
      .json()

    if (isSorting) {
      setSorting(false)
    } else {
      setSorting(true)
    }
    if (isSortingByFileName) {
      setSortingByFileName(false)
    } else {
      setSortingByFileName(true)
    }
    getDocReportData(orderBy, sortBy)
  }

  let checkID = (checkList: ReportAndVideoList["data"]) => {
    var checkedDoc = checkList.filter((item: ReportAndVideoObj) => {
      return item.checked == true
    })

    if (checkedDoc.length) {
      setdownloadShow(true)
    } else {
      setdownloadShow(false)
    }
  }

  const viewDoc = (
    item: ReportAndVideoObj,
    e: React.MouseEvent<HTMLElement>,
  ) => {
    if (isMobView) {
      fileDownloadView("view", item)
      e.stopPropagation()
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
            <Hide below="md">
              <Breadcrumb fontSize="12px">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    color="rgb(185, 152, 85)"
                    href="./"
                    _focus={{ boxShadow: "none" }}
                  >
                    {t("heading")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">
                    {" "}
                    {t(`folder.${folderName?.replace(" ", "_").toLowerCase()}`)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Hide>
            <Flex
              align="right"
              justifyContent="space-between"
              d={{ base: "block", md: "flex" }}
              mb="40px"
            >
              <Box
                as="header"
                fontWeight="400"
                fontSize="30px"
                lineHeight="120%"
                mt="16px"
                color="#fff"
              >
                {t(`folder.${folderName.replace(" ", "_").toLowerCase()}`)}
              </Box>
              {downloadShow && (
                <Box
                  d={{ md: "block", base: "flex" }}
                  justifyContent="flex-end"
                >
                  <Button
                    pl="15px"
                    mt="16px"
                    variant="outline"
                    color="primary.500"
                    fontSize="14px"
                    fontWeight="400"
                    textDecoration="auto"
                    borderColor="#B99855"
                    background="transparent"
                    border="1px solid #B99855"
                    borderRadius="2px"
                    onClick={() => {
                      fileDownloadView("multipleDownload", isMultiDownload)
                    }}
                  >
                    <DownloadIcon mr="5px" mt="-2px" />
                    {t("labels.download")}
                  </Button>
                </Box>
              )}
            </Flex>
            {docCenterReportData?.length == 0 || !docCenterReportData ? (
              <Box>
                <NoDataFound isDescription isHeader isIcon />
              </Box>
            ) : (
              <Box>
                <Flex
                  justify="flex-start"
                  align="center"
                  mb="16px"
                  width="100%"
                >
                  <Box d="block" mr="6px">
                    <Checkbox
                      aria-label="Select All"
                      role={"checkbox"}
                      onChange={(e) => selectAll("All", e.target.checked)}
                      name="All"
                      value="ALL"
                      isChecked={isAllSelected}
                      bg="gray.800"
                      borderColor="gray.800"
                    />
                  </Box>
                  <Grid
                    alignItems="center"
                    templateColumns={{
                      base: "repeat(4, 1fr)",
                      md: "repeat(3, 1fr)",
                      lgp: "repeat(3, 1fr)",
                    }}
                    w={{ lgp: "100%", md: "100%", base: "100%" }}
                    ml={{ lgp: "40px", md: "0", base: "0" }}
                  >
                    <GridItem colSpan={{ base: 3, md: 1, lgp: 1 }}>
                      <Box
                        className="sortArea"
                        color="#b99855"
                        fontSize="16px"
                        fontWeight="500"
                        cursor="pointer"
                        d="inline-flex"
                        onClick={() =>
                          sortData(
                            isSortingByFileName ? "desc" : "asc",
                            "fileName",
                          )
                        }
                        justifyContent="center"
                        alignItems="center"
                      >
                        {t("labels.name")}
                        <Box
                          as="span"
                          transform={
                            isSortingByFileName ? "initial" : "rotate(180deg)"
                          }
                        >
                          <ArrowDateIcon />
                        </Box>
                      </Box>
                    </GridItem>
                    <GridItem colSpan={{ base: 0, md: 1, lgp: 1 }}>
                      <Box
                        aria-label="Date"
                        role={"button"}
                        className="sortArea"
                        color="#b99855"
                        fontSize="16px"
                        fontWeight="500"
                        cursor="pointer"
                        d={{
                          base: "none",
                          lgp: "inline-flex",
                          md: "inline-flex",
                        }}
                        onClick={() =>
                          sortData(isSorting ? "asc" : "desc", "date")
                        }
                        justifyContent="center"
                        alignItems="center"
                      >
                        {t("labels.date")}
                        <Box
                          as="span"
                          transform={isSorting ? "rotate(180deg)" : "initial"}
                        >
                          <ArrowDateIcon />
                        </Box>
                      </Box>
                    </GridItem>
                  </Grid>
                </Flex>
                {docCenterReportData?.length
                  ? docCenterReportData?.map((item, index) => (
                      <Flex
                        mt="6px"
                        key={index}
                        justify="flex-start"
                        align="center"
                        mb="5px"
                        onClick={() => {
                          isMobView
                            ? setCheckBoxShow(true)
                            : setCheckBoxShow(false)
                        }}
                        width="100%"
                      >
                        <Hide below="md">
                          <Box mr="6px">
                            <Checkbox
                              aria-label="checkbox"
                              role={"checkbox"}
                              bg="gray.800"
                              borderColor="gray.800"
                              onChange={(e) =>
                                selectAll(item.name, e.target.checked)
                              }
                              name="filename"
                              value={item.name}
                              isChecked={item.checked}
                            />
                          </Box>
                        </Hide>
                        <Grid
                          d={{ base: "block", md: "grid" }}
                          alignItems="center"
                          templateColumns={{
                            base: "repeat(4, 1fr)",
                            md: "repeat(3, 1fr)",
                            lgp: "repeat(3, 1fr)",
                          }}
                          w={{ lgp: "100%", md: "100%", base: "100%" }}
                          p="12px"
                          bg="#222"
                          _hover={{
                            backgroundColor: "#263134",
                            cursor: "pointer",
                          }}
                          ml={{ lgp: "40px", md: "0", base: "0" }}
                        >
                          <GridItem
                            wordBreak="break-all"
                            colSpan={{ base: 3, md: 1, lgp: 1 }}
                          >
                            <Box
                              pr={{ lgp: "15px", md: "15px", base: "0" }}
                              display="flex"
                              alignItems="center"
                              verticalAlign="middle"
                            >
                              <Show below="md">
                                {(isCheckBoxShow || isAllSelected) && (
                                  <Checkbox
                                    bg="gray.800"
                                    onChange={(e) =>
                                      selectAll(item.name, e.target.checked)
                                    }
                                    name="filename"
                                    value={item.name}
                                    isChecked={item.checked}
                                  />
                                )}
                              </Show>
                              <Box as="span">
                                {item.type == "pdf" && (
                                  <svg
                                    width="48px"
                                    height="48px"
                                    viewBox="0 0 48 48"
                                    fill="#C7C7C7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ display: "inline-block" }}
                                  >
                                    <circle
                                      opacity="0.15"
                                      cx="24"
                                      cy="24"
                                      r="18"
                                      fill="#C7C7C7"
                                    ></circle>
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M30.6087 20.5217V22.9565H17.3913V16.3478C17.3913 16.1558 17.5468 16 17.7391 16H26.087V20.1739C26.087 20.3659 26.2424 20.5217 26.4348 20.5217H30.6087ZM17.3913 31.6522V30.6087H30.6087V31.6522C30.6087 31.8442 30.4532 32 30.2609 32H17.7391C17.5468 32 17.3913 31.8442 17.3913 31.6522ZM26.7826 16.5516V19.8261H30.057L26.7826 16.5516ZM21.3893 26.0386H21.5799C21.784 26.0386 21.886 26.1307 21.8863 26.3151C21.8863 26.4243 21.8536 26.5102 21.7882 26.5725C21.7228 26.6351 21.6348 26.6664 21.5239 26.6664H21.3893V26.0386ZM24.0213 26.0386H23.8064V27.5683H23.9709C24.1953 27.5683 24.3594 27.5029 24.4641 27.3728C24.5688 27.2427 24.621 27.0438 24.621 26.7759C24.621 26.5255 24.5716 26.3401 24.4725 26.2191C24.3733 26.0987 24.2231 26.0386 24.0213 26.0386ZM16.3478 23.6522H31.6522C31.8442 23.6522 32 23.808 32 24V29.5652C32 29.7572 31.8442 29.913 31.6522 29.913H16.3478C16.1558 29.913 16 29.7572 16 29.5652V24C16 23.808 16.1558 23.6522 16.3478 23.6522ZM21.5965 27.2678C21.928 27.2678 22.1833 27.185 22.3635 27.0184C22.5433 26.8522 22.6334 26.6163 22.6334 26.311C22.6334 26.0334 22.5468 25.8191 22.3736 25.6682C22.2007 25.5179 21.9416 25.4424 21.5965 25.4424H20.6511V28.1739H21.3892V27.2678H21.5965ZM23.9523 28.1739C24.407 28.1739 24.7597 28.0508 25.0104 27.8042C25.2616 27.5576 25.3871 27.2063 25.3871 26.7503C25.3871 26.3266 25.2678 26.0031 25.0292 25.7788C24.7906 25.5544 24.4522 25.4424 24.0139 25.4424H23.0685V28.1739H23.9523ZM26.6035 26.0348H27.4908H27.4911V25.4424H25.8769V28.1739H26.6035V27.1482H27.4219V26.5562H26.6035V26.0348Z"
                                      fill="#C7C7C7"
                                    ></path>
                                  </svg>
                                )}
                                {item.type == "video" && (
                                  <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      opacity="0.15"
                                      cx="24"
                                      cy="24"
                                      r="18"
                                      fill="#C7C7C7"
                                    />
                                    <path
                                      d="M31 16H17C16.4 16 16 16.4 16 17V31C16 31.6 16.4 32 17 32H31C31.6 32 32 31.6 32 31V17C32 16.4 31.6 16 31 16ZM26.6 24.8L22.6 27.8C22 28.3 21 27.8 21 27V21C21 20.2 21.9 19.7 22.6 20.2L26.6 23.2C27.1 23.6 27.1 24.4 26.6 24.8Z"
                                      fill="#C7C7C7"
                                    />
                                  </svg>
                                )}
                              </Box>
                              <Box
                                px="15px"
                                onClick={(e) => {
                                  viewDoc(item, e)
                                }}
                                wordBreak={{
                                  base: "break-word",
                                  md: "inherit",
                                  lgp: "inherit",
                                }}
                                style={{
                                  direction: "ltr",
                                }}
                                textAlign={lang === "ar" ? "end" : "start"}
                              >
                                <Box
                                  fontStyle="normal"
                                  fontSize="14px"
                                  fontWeight="700"
                                  lineHeight="21px"
                                  mb="4px"
                                  aria-label="file name"
                                  role={"cell"}
                                >
                                  {item.name}
                                </Box>
                                <Flex
                                  fontStyle="normal"
                                  fontWeight="400"
                                  fontSize="14px"
                                  color="#c7c7c7"
                                  lineHeight="21px"
                                  d={{
                                    base: "block",
                                    md: "block",
                                    lgp: "block",
                                  }}
                                  textAlign={lang === "ar" ? "end" : "start"}
                                >
                                  <Box
                                    style={{ direction: "ltr" }}
                                    textAlign={lang === "ar" ? "end" : "start"}
                                    whiteSpace="nowrap"
                                  >
                                    <Box
                                      as="span"
                                      pr={lang === "ar" ? "0" : "5px"}
                                      pl={lang === "ar" ? "5px" : "0"}
                                    >
                                      {item.size},
                                    </Box>
                                    <Box as="span">
                                      {item.contentType == "video/mp4"
                                        ? item.length
                                        : item.length + " pages"}
                                    </Box>
                                  </Box>
                                </Flex>
                              </Box>
                            </Box>
                          </GridItem>
                          <GridItem
                            colSpan={{ base: 0, md: 1, lgp: 1 }}
                            wordBreak="break-all"
                            d={{ base: "none", md: "grid", lgp: "grid" }}
                          >
                            <Text
                              aria-label="date"
                              fontStyle="normal"
                              fontWeight="400"
                              fontSize="14px"
                              color="#c7c7c7"
                            >
                              {moment(item.date).format("DD/MM/YYYY")}
                            </Text>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Flex align="center" justify="flex-end">
                              <Box
                                px="15px"
                                d={{ base: "none", md: "block", lgp: "block" }}
                                className="tooltip"
                              >
                                <Link
                                  href={`mailto:${email}?subject=${item.name}`}
                                  target="_blank"
                                >
                                  <IconButton
                                    bg="transaprent"
                                    variant="ghost"
                                    colorScheme="primary"
                                    px="2"
                                    href="/support"
                                    role="link"
                                    aria-label="Support Icon"
                                    icon={<QuestionIcon />}
                                    _hover={{ bg: "transaprent" }}
                                  />
                                  <span className="tooltiptext">
                                    Ask about this file
                                  </span>
                                </Link>
                              </Box>
                              <Box p={{ base: "0 0 0 15px", md: "0 15px" }}>
                                <Button
                                  color="primary.400"
                                  fontSize="14px"
                                  fontWeight="400"
                                  variant="link"
                                  textDecoration="auto"
                                  onClick={() => {
                                    fileDownloadView("download", item)
                                  }}
                                >
                                  {t("labels.download")}
                                </Button>
                              </Box>
                              <Box
                                pl="15px"
                                pr="24px"
                                d={{ base: "none", md: "block", lgp: "block" }}
                              >
                                <Button
                                  color="primary.400"
                                  fontSize="14px"
                                  fontWeight="400"
                                  variant="link"
                                  textDecoration="auto"
                                  onClick={() => {
                                    fileDownloadView("view", item)
                                  }}
                                >
                                  {t("labels.view")}
                                </Button>
                              </Box>
                              {item.contentType == "video/mp4" &&
                              IsViewVideo ? (
                                <VideoModelBox
                                  VideoURL={viewURL}
                                  VideoType={item.contentType}
                                  show={IsViewVideo}
                                  close={() => setIsViewVideo(false)}
                                />
                              ) : isViewPdf &&
                                (item.contentType == "application/pdf" ||
                                  item.contentType ==
                                    "application/octet-stream") ? (
                                <PdfModelBox
                                  pdfURL={viewURL}
                                  show={isViewPdf}
                                  close={() => setIsViewPdf(false)}
                                />
                              ) : (
                                false
                              )}
                            </Flex>
                          </GridItem>
                        </Grid>
                      </Flex>
                    ))
                  : false}
              </Box>
            )}

            {isPagination && (
              <Center w="full" justifyContent="flex-end">
                <Pagination
                  currentPage={currentPage}
                  pageLength={totalPages}
                  paginationOnClick={(i) => {
                    i && setCurrentPage(i)
                  }}
                />
              </Center>
            )}
          </Box>
        )}
        <FeedbackModal
          hideReferalOption={true}
          isOpen={isFeedbackModalOpen}
          onClose={async () => {
            onFeedbackModalClose()
            setFeedbackCookieStatus(
              siteConfig.clientFeedbackSessionVariableName,
              false,
              siteConfig.clientFeedbackSessionExpireDays,
            )
          }}
          submissionScreen={FeedbackSubmissionScreen.ClientStatementDownload}
        />
      </PageContainer>
    </ClientLayout>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function (ctx) {
    const sesison = getSession(ctx.req, ctx.res)
    if (sesison?.mandateId && ctx?.params?.docReport) {
      return {
        props: {
          folderName: ctx?.params?.docReport,
        }, // will be passed to the page component as props
      }
    }
    return {
      notFound: true,
    }
  },
})
