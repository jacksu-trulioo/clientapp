import { Flex, HStack, IconButton, Spacer, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CaretLeftIcon, CaretRightIcon } from "."

type PaginationFunction = (index?: number) => void

interface PaginationProps {
  paginationOnClick?: PaginationFunction
  currentPage?: number
  pageLength?: number
}

/**
 *
 * @property {Function} PaginationOnClick triggered when the next or previous button is clicked, and gets the current or next page
 * @property {number} currentPage The current page
 * @property {number} pageLength the maximum page length
 * @example
 * <Pagination currentPage={currentPage} pageLength={maxLength} paginationOnClick={(i) => setCurrentPage(i)}  />
 */

function Pagination(props: React.PropsWithChildren<PaginationProps>) {
  const { paginationOnClick, currentPage = 1, pageLength = 2 } = props
  const { t, lang } = useTranslation("common")
  let currentPageVar = currentPage

  return (
    <Flex
      aria-label="pagination"
      justify="space-between"
      alignItems="center"
      padding="2"
    >
      <Spacer />
      <HStack gridGap={"32px"}>
        <Text aria-label="Page" userSelect="none">
          {t`pagination.page`} {currentPage} {t`pagination.of`} {pageLength}
        </Text>

        <IconButton
          disabled={currentPage === 1}
          aria-label="previousPage"
          // icon={<CaretLeftIcon w="5" h="5" color="primary.500" />}
          icon={
            lang === "ar" ? (
              <CaretRightIcon w="5" h="5" color="primary.500" />
            ) : (
              <CaretLeftIcon w="5" h="5" color="primary.500" />
            )
          }
          colorScheme="primary.500"
          cursor="pointer"
          onClick={() => {
            paginationOnClick &&
              paginationOnClick(currentPage - 1 == 0 ? 1 : currentPage - 1)
          }}
        />

        <IconButton
          disabled={currentPageVar++ >= pageLength}
          aria-label="nextPage"
          icon={
            lang === "ar" ? (
              <CaretLeftIcon w="5" h="5" color="primary.500" />
            ) : (
              <CaretRightIcon w="5" h="5" color="primary.500" />
            )
          }
          colorScheme="primary.500"
          cursor="pointer"
          onClick={() => {
            let num = currentPage
            paginationOnClick &&
              paginationOnClick(num++ >= pageLength ? pageLength : num++)
          }}
        />
      </HStack>
    </Flex>
  )
}

export default Pagination
