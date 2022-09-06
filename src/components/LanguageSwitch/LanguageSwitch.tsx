import { Button, HTMLChakraProps, Text, useToast } from "@chakra-ui/react"
import ky from "ky"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { ArabicLangIcon } from "~/components"
import { useUser } from "~/hooks/useUser"
import { Preference } from "~/services/mytfo/types"
import { LanguageChangeSuccessEvent } from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

interface LanguageSwitchProps extends HTMLChakraProps<"button"> {}

export default function LanguageSwitch(props: LanguageSwitchProps) {
  const { push, reload, asPath, locale } = useRouter()
  const isEnglish = locale === "en"
  const { user } = useUser()
  const toast = useToast()
  const { t } = useTranslation()

  const toastId = "language-toast-error"

  const toggle = async () => {
    if (user?.profile) {
      try {
        event(LanguageChangeSuccessEvent)

        await ky
          .post("/api/user/preference", {
            json: {
              language: isEnglish ? "AR" : "EN",
            },
          })
          .json<Preference>()

        toast({
          title: t("common:toast.preferences.title"),
          description: t("common:toast.preferences.description"),
          status: "success",
          isClosable: true,
          variant: "subtle",
          position: "top",
        })

        await push(asPath, asPath, { locale: isEnglish ? "ar" : "en" })

        // A force reload is required to toggle RTL.
        reload()
      } catch (error) {
        // Show toast error.
        if (!toast.isActive(toastId)) {
          toast({
            id: toastId,
            title: t("common:toast.generic.error.title"),
            variant: "subtle",
            status: "error",
            isClosable: true,
            position: "bottom",
          })
        }
      }
    } else {
      await push(asPath, asPath, { locale: isEnglish ? "ar" : "en" })
      // A force reload is required to toggle RTL.
      reload()
    }
  }

  return (
    <Button
      colorScheme="primary"
      variant="ghost"
      onClick={toggle}
      px="2"
      aria-label="Toggle language"
      {...props}
    >
      {isEnglish ? (
        <ArabicLangIcon />
      ) : (
        <Text fontSize="sm" textDecoration="none">
          English
        </Text>
      )}
    </Button>
  )
}
