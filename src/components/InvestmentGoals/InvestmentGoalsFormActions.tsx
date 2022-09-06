import { Button } from "@chakra-ui/button"
import { Stack } from "@chakra-ui/layout"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { Portal } from "@chakra-ui/portal"
import { FormikProps } from "formik"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { InvestorProfileGoals } from "~/services/mytfo/types"

import { useInvestmentGoalsFormContext } from "./InvestmentGoalsFormContext"

interface InvestmentGoalsFormActions
  extends FormikProps<InvestorProfileGoals> {}

const InvestmentGoalsFormActions = React.forwardRef<
  HTMLDivElement,
  InvestmentGoalsFormActions
>(function InvestmentGoalsFormActions(props, ref) {
  const { submitForm, isSubmitting } = props
  const { isFirstPage, previousPage } = useInvestmentGoalsFormContext()
  const { t } = useTranslation()
  const isFullWidth = useBreakpointValue({ base: true, md: false })

  return (
    <Portal containerRef={ref as React.RefObject<HTMLDivElement>}>
      <Stack
        isInline
        spacing={{ base: 4, md: 8 }}
        px={{ base: 0, md: 3 }}
        flex="1"
        justifyContent="flex-end"
      >
        {!isFirstPage && (
          <Button
            colorScheme="primary"
            variant="outline"
            minW={{ base: "auto", md: "110px" }}
            onClick={previousPage}
            isFullWidth={isFullWidth}
          >
            {t("common:button.back")}
          </Button>
        )}

        <Button
          colorScheme="primary"
          minW={{ base: "auto", md: "110px" }}
          type="submit"
          onClick={submitForm}
          isLoading={isSubmitting}
          loadingText={t("common:button.next")}
          isFullWidth={isFullWidth}
        >
          {t("common:button.next")}
        </Button>
      </Stack>
    </Portal>
  )
})

export default React.memo(InvestmentGoalsFormActions)
