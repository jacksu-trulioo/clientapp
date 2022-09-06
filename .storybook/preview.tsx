import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { StoryContext } from "@storybook/react"
import { themes } from "@storybook/theming"
import { RouterContext } from "next/dist/shared/lib/router-context" // next 11.1
import I18nProvider from "next-translate/I18nProvider"
import * as React from "react"

import Fonts from "~/components/Fonts"
import theme from "~/styles/theme"

import i18nConfig from "../i18n"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  docs: {
    theme: themes.dark,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}

/**
 * Add global context for RTL-LTR switching
 */
export const globalTypes = {
  direction: {
    name: "Direction",
    description: "Direction for layout",
    defaultValue: "LTR",
    toolbar: {
      icon: "globe",
      items: ["LTR", "RTL"],
    },
  },
}

const withChakra = (Story: Function, context: StoryContext) => {
  const { direction } = context.globals
  const dir = direction.toLowerCase()

  return (
    <ChakraProvider resetCSS theme={extendTheme(theme, { direction: dir })}>
      <div dir={dir}>
        <Fonts />
        <Story />
      </div>
    </ChakraProvider>
  )
}

const withI18nProvider = (Story: Function, context: StoryContext) => {
  const { direction } = context.globals
  const dir = direction.toLowerCase()
  const lang = dir === "rtl" ? "ar" : "en"

  const namespaces = Array.from(new Set(Object.values(i18nConfig.pages).flat()))

  const locales = namespaces.reduce((acc, name) => {
    let translations = {}

    try {
      translations = require(`../public/locales/${lang}/${name}.json`)
    } catch (e) {
      translations = require(`../public/locales/en/${name}.json`)
    }

    return {
      ...acc,
      [name]: translations,
    }
  }, {})

  return (
    <I18nProvider lang={lang} namespaces={locales} config={i18nConfig}>
      <Story />
    </I18nProvider>
  )
}

export const decorators = [withChakra, withI18nProvider]
