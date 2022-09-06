import { Container } from "@chakra-ui/layout"
import React from "react"

import {
  BackgroundImageContainer,
  BackgroundImageContainerProps,
  Seo,
} from "~/components"

import PageContainer from "./PageContainer"

interface ModalLayoutProps extends BackgroundImageContainerProps {
  title: string
  description: string
  hideBgImage?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
  containerRef?: React.Ref<HTMLDivElement>
  onScroll?: React.UIEventHandler<HTMLDivElement>
}

export function ModalLayout(props: React.PropsWithChildren<ModalLayoutProps>) {
  const {
    children,
    containerRef,
    title,
    description,
    hideBgImage,
    header,
    footer,
    onScroll,
    ...rest
  } = props

  return (
    <>
      <Seo title={title} description={description} />

      <BackgroundImageContainer
        display="flex"
        flexDirection="column"
        height="100%"
        hideBgImage={hideBgImage}
        {...rest}
      >
        {header}

        <PageContainer
          ref={containerRef}
          as="main"
          flex="1"
          overflow="auto"
          height="full"
          maxW="full"
          py={{ base: 8, md: 0 }}
          onScroll={onScroll}
          id="wizzScrollMainCont"
        >
          <Container maxW="full" px="0" h="auto">
            {children}
          </Container>
        </PageContainer>

        {footer}
      </BackgroundImageContainer>
    </>
  )
}

export default React.memo(ModalLayout)
