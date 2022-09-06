import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useDisclosure } from "@chakra-ui/react"
import ky from "ky"
import moment from "moment"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"
import { Fragment, useEffect, useState } from "react"

import {
  ClientLayout,
  ConfirmModalBox,
  FeedbackModal,
  ModalBox,
  PageContainer,
  SkeletonCard,
  TotalCommitment,
} from "~/components"
import siteConfig from "~/config"
import { useUser } from "~/hooks/useUser"
import {
  Commitment,
  FeedbackSubmissionScreen,
  FilterDataType,
  FilterOptionType,
} from "~/services/mytfo/types"
import {
  getFeedbackCookieStatus,
  setFeedbackCookieStatus,
} from "~/utils/clientUtils/feedbackCookieUtilities"
import { downloadBlob } from "~/utils/downloadBlob"
import { downloadedExcel, screenSpentTime } from "~/utils/googleEventsClient"
import { clientEvent } from "~/utils/gtag"

type TotalCommitmentDataProps = {
  lastValuationDate: string
  totalCommitted: number
  totalUncalled: number
  commitments: Commitment[]
}

type ChipDataType = {
  label: string | number
  value: string | number
}

const TotalCommitmentsPage = () => {
  const { user } = useUser()
  const { t } = useTranslation("totalCommitment")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filterType, setFilterType] = useState("asc")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState(false)
  const [downloadConfirmation, setDownloadConfirmation] = useState(false)
  const [activeFilterOptions, setActiveFilterOptions] = useState<
    ChipDataType[]
  >([])
  const [deployedFilterOptions, setDeployedFilterOptions] = useState<
    FilterOptionType[]
  >([
    {
      isSelected: false,
      label: "0% - 49%",
      value: 49,
    },
    {
      isSelected: false,
      label: "50% - 99%",
      value: 99,
    },
    {
      isSelected: false,
      label: "100%",
      value: 100,
    },
  ])
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose,
  } = useDisclosure()

  const [commitmentData, setCommitmentData] =
    useState<TotalCommitmentDataProps>()

  useEffect(() => {
    getCommitmentData(deployedFilterOptions, filterType)
  }, [])

  useEffect(() => {
    const openTime = moment(new Date())
    return () => {
      const closeTime = moment(new Date())
      let duration = moment.duration(closeTime.diff(openTime))
      clientEvent(
        screenSpentTime,
        "Total Commitments",
        duration.asSeconds().toString(),
        user?.mandateId as string,
        user?.email as string,
      )
    }
  }, [])

  const getCommitmentData = async (
    filterValues: FilterOptionType[],
    orderBy: string,
  ) => {
    setIsLoading(true)
    var values: string[] = []
    filterValues
      .filter(({ isSelected }) => {
        return isSelected
      })
      .forEach(({ value }) => {
        if (value == 49) {
          values.push("0-49")
        }

        if (value == 99) {
          values.push("50-99")
        }

        if (value == 100) {
          values.push("100")
        }
      })

    if (values.length == 0) {
      values.push("0-100")
      setActiveFilterOptions([])
    }

    try {
      var response = await ky
        .post("/api/client/commitment/total-commitment-details", {
          json: {
            filterKeys: ["deployed"],
            filterValues: values,
            sortBy: "deployed",
            orderBy: orderBy,
          },
        })
        .json()
      setCommitmentData(response as TotalCommitmentDataProps)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError(true)
    }
  }

  const updateFilter = (filterObj: {
    filterValues: FilterOptionType[]
    orderBy: string
  }) => {
    setDeployedFilterOptions(filterObj.filterValues)
    setFilterType(filterObj.orderBy)
    getCommitmentData(filterObj.filterValues, filterObj.orderBy)
  }

  const updateChips = (filterOptions: FilterDataType[]) => {
    var chipsData = filterOptions
      .find(({ filterNameKey }) => {
        return filterNameKey == "deployed"
      })
      ?.filterOptions.filter(({ isSelected }) => {
        return isSelected
      })
      .map(({ value, label }) => {
        return {
          value,
          label,
        }
      })
    if (chipsData?.length) {
      setActiveFilterOptions([...chipsData])
    }
  }

  const onChipClose = (value: string | number, index: number) => {
    activeFilterOptions.splice(index, 1)
    setActiveFilterOptions([...activeFilterOptions])
    var optionIndex = deployedFilterOptions.findIndex((option) => {
      return option.value == value
    })
    deployedFilterOptions[optionIndex].isSelected = false
    setDeployedFilterOptions([...deployedFilterOptions])
    getCommitmentData(deployedFilterOptions, filterType)
  }

  const onChipClear = () => {
    setActiveFilterOptions([])

    setDeployedFilterOptions(
      deployedFilterOptions.map((data) => {
        data.isSelected = false
        return data
      }),
    )
    getCommitmentData(deployedFilterOptions, filterType)
  }

  const onFilterClear = () => {
    setActiveFilterOptions([])
    setDeployedFilterOptions(
      deployedFilterOptions.map((data) => {
        data.isSelected = false
        return data
      }),
    )
    getCommitmentData(deployedFilterOptions, "asc")
  }

  useEffect(() => {
    if (isLoading) {
      setIsPageLoading(true)
    } else {
      setIsPageLoading(false)
    }
  }, [isLoading])

  const downloadTableDataInExcel = async (type?: string) => {
    let filterValues: string[] = []
    if (type != "all") {
      deployedFilterOptions
        .filter(({ isSelected }) => {
          return isSelected
        })
        .forEach(({ value }) => {
          if (value == 49) {
            filterValues.push("0-49")
          }

          if (value == 99) {
            filterValues.push("50-99")
          }

          if (value == 100) {
            filterValues.push("100")
          }
        })
    }
    if (filterValues.length == 0) {
      filterValues.push("0-100")
    }

    let response = await ky.post("/api/client/generate-excel-file", {
      json: {
        type: "totalCommitment",
        filterValues,
        orderBy: "deployed",
      },
    })
    let fileData = await response.blob()
    let fileName = `${user?.mandateId}-Total-Commitments`
    downloadBlob(window.URL.createObjectURL(fileData), fileName)
    clientEvent(
      downloadedExcel,
      "Total Commitments",
      fileName,
      user?.mandateId as string,
      user?.email as string,
    )
    if (
      getFeedbackCookieStatus(siteConfig.clientFeedbackSessionVariableName) ==
      "true"
    ) {
      setTimeout(() => {
        onFeedbackModalOpen()
      }, 500)
    }
  }

  const checkFiltersForDownload = () => {
    if (activeFilterOptions.length) {
      setDownloadConfirmation(true)
    } else {
      downloadTableDataInExcel()
    }
  }

  return (
    <Fragment>
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
            <Fragment>
              {!error && commitmentData ? (
                <TotalCommitment
                  deployedFilterOptions={deployedFilterOptions}
                  selectedOrderOption={filterType}
                  updateFilter={updateFilter}
                  commitmentData={commitmentData}
                  updateChips={updateChips}
                  activeFilterOptions={activeFilterOptions}
                  onChipClose={onChipClose}
                  onChipClear={onChipClear}
                  onFilterClear={onFilterClear}
                  downloadTableDataInExcel={checkFiltersForDownload}
                />
              ) : (
                <ModalBox
                  isOpen={true}
                  modalDescription={t(
                    "common:client.errors.noDate.description",
                  )}
                  modalTitle={t("common:client.errors.noDate.title")}
                  primaryButtonText={t("common:client.errors.noDate.button")}
                  onClose={() => {
                    router.push("/client/portfolio-summary")
                  }}
                  onPrimaryClick={() => {
                    router.push("/client/portfolio-summary")
                  }}
                />
              )}
            </Fragment>
          )}
          {downloadConfirmation && (
            <ConfirmModalBox
              isOpen={true}
              onClose={() => {
                setDownloadConfirmation(false)
              }}
              bodyContent={t(`common:client.downloadPreference.bodyText`)}
              firstButtonText={t(
                `common:client.downloadPreference.preferences.mySelection`,
              )}
              secondButtonText={t(
                `common:client.downloadPreference.preferences.allData`,
              )}
              firstButtonOnClick={() => {
                downloadTableDataInExcel()
                setDownloadConfirmation(false)
              }}
              secondButtonOnClick={() => {
                downloadTableDataInExcel("all")
                setDownloadConfirmation(false)
              }}
            />
          )}
          <FeedbackModal
            hideReferalOption={true}
            isOpen={isFeedbackModalOpen}
            onClose={() => {
              onFeedbackModalClose()
              setFeedbackCookieStatus(
                siteConfig.clientFeedbackSessionVariableName,
                false,
                siteConfig.clientFeedbackSessionExpireDays,
              )
            }}
            submissionScreen={FeedbackSubmissionScreen.ClientDownloadTableData}
          />
        </PageContainer>
      </ClientLayout>
    </Fragment>
  )
}

export default TotalCommitmentsPage

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
