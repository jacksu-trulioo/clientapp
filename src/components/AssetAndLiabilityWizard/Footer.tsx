import { Button, HStack, StackDivider } from "@chakra-ui/react"
import { useFormikContext } from "formik"
import useTranslation from "next-translate/useTranslation"
import React, { useCallback, useMemo } from "react"

import ModalFooter from "../ModalFooter"
import { Step, useStepper } from "./Stepper"

type Props = {
  onAdd?: () => void
  onClose?: () => void
}

function Footer({ onClose, onAdd }: Props) {
  const { t } = useTranslation("common")
  const { step, back } = useStepper()
  const { handleSubmit } = useFormikContext()

  const onSubmit = useCallback(() => {
    handleSubmit()
    if (onAdd) {
      onAdd()
    }
  }, [handleSubmit, onAdd])

  const cta = useMemo(() => {
    const buttonsMap = {
      [Step.ADD_ASSETS_OR_LIABILITIES]: (
        <Button
          colorScheme="primary"
          variant="outline"
          onClick={onClose}
          data-testid="asset-and-liability-wizard-footer-cancel-button"
        >
          {t("button.cancel")}
        </Button>
      ),
      [Step.ADD_BANK_ACCOUNTS]: (
        <Button
          colorScheme="primary"
          variant="outline"
          onClick={back}
          data-testid="asset-and-liability-wizard-footer-back-button"
        >
          {t("button.back")}
        </Button>
      ),
      [Step.FILL_DETAILS]: (
        <HStack divider={<StackDivider borderColor="transparent" />}>
          <Button
            colorScheme="primary"
            variant="outline"
            onClick={back}
            data-testid="asset-and-liability-wizard-footer-back-button"
          >
            {t("button.back")}
          </Button>
          <Button
            colorScheme="primary"
            variant="solid"
            onClick={onSubmit}
            data-testid="asset-and-liability-wizard-footer-save-button"
          >
            {t("button.add")}
          </Button>
        </HStack>
      ),
    }
    return buttonsMap[step]
  }, [onClose, t, back, onSubmit, step])

  return <ModalFooter>{cta}</ModalFooter>
}

Footer.displayName = "AssetAndLiabilityWizardFooter"

export default Footer
