import { Button, HTMLChakraProps, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { Fragment } from "react"

import { ArabicLangIcon } from "~/components"

interface LanguageSwitchProps extends HTMLChakraProps<"button"> {}

export default function LanguageSwitch(props: LanguageSwitchProps) {
  const { locale, push, asPath } = useRouter()
  const isEnglish = locale === "en"

  const toggle = async () => {
    push("/client/setting")
  }

  return (
    <Fragment>
      {asPath != "/client/setting" ? (
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
      ) : (
        false
      )}
    </Fragment>
  )
}
