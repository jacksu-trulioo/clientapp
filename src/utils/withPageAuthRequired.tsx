import { Button } from "@chakra-ui/button"
import { Box, Heading, Text, VStack } from "@chakra-ui/layout"
import { datadogRum } from "@datadog/browser-rum"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Header } from "~/components"
import { useUser } from "~/hooks/useUser"
import { User } from "~/services/mytfo/types"
import { isMinimumProfileCompleted } from "~/utils/isMinimumProfileCompleted"

const ErrorComponent = (error: Error) => {
  const { t } = useTranslation("common")
  const { reload } = useRouter()

  if (error) {
    datadogRum.addError(error)
  }

  return (
    <>
      <Header />

      <Box as="main">
        <VStack
          justify="center"
          spacing="4"
          as="section"
          py={["20", null, "40"]}
          textAlign="center"
        >
          <Heading as="h1" fontSize="2xl" fontWeight="bold">
            {t("toast.generic.error.title")}
          </Heading>
          <Text>
            {t("generic.please")}{" "}
            <Button variant="link" colorScheme="primary" onClick={reload}>
              {t("button.retry")}
            </Button>
          </Text>
        </VStack>
      </Box>
    </>
  )
}

ErrorComponent.displayName = "ErrorComponent"

const defaultOnRedirecting = (): JSX.Element => <></>

const defaultOnError = ErrorComponent

/**
 * Options for the withPageAuthRequired Higher Order Component
 *
 * @category Client
 */
export interface WithPageAuthRequiredOptions {
  /**
   * ```js
   * withPageAuthRequired(Profile, {
   *   returnTo: '/profile'
   * });
   * ```
   *
   * Add a path to return the user to after login.
   */
  returnTo?: string
  /**
   * ```js
   * withPageAuthRequired(Profile, {
   *   onRedirecting: () => <div>Redirecting you to the login...</div>
   * });
   * ```
   *
   * Render a message to show that the user is being redirected to the login.
   */
  onRedirecting?: () => JSX.Element
  /**
   * ```js
   * withPageAuthRequired(Profile, {
   *   onError: error => <div>Error: {error.message}</div>
   * });
   * ```
   *
   * Render a fallback in case of error fetching the user from the profile API route.
   */
  onError?: (error: Error) => JSX.Element
}

export interface WithPageAuthRequiredProps {
  user: User
  [key: string]: unknown
}

/**
 * ```js
 * const MyProtectedPage = withPageAuthRequired(MyPage);
 * ```
 *
 * When you wrap your pages in this Higher Order Component and an anonymous user visits your page
 * they will be redirected to the login page and then returned to the page they were redirected from (after login).
 *
 * @category Client
 */
export type WithPageAuthRequired = <P extends WithPageAuthRequiredProps>(
  Component: React.ComponentType<Omit<P, "user">>,
  options?: WithPageAuthRequiredOptions,
) => React.FC<Omit<P, "user">>

/**
 * @ignore
 */
const withPageAuthRequired: WithPageAuthRequired = (
  Component,
  options = {},
) => {
  return function WithPageAuthRequired(props): JSX.Element {
    const { onRedirecting = defaultOnRedirecting, onError = defaultOnError } =
      options
    const router = useRouter()
    const { user, error, isLoading } = useUser()

    // Redirect if user is authenticated but fails certain guards.
    React.useEffect(() => {
      if (location.pathname.includes(router.asPath)) return

      if (user && !error) {
        // Redirect if email is unverified.
        if (!user?.emailVerified) {
          router.replace("/verify")
          // Redirect if profile is incomplete.
        }
        if (!user?.profile) {
          router.replace("/onboarding/profile")
        }

        if (user?.profile) {
          if (!isMinimumProfileCompleted(user.profile)) {
            router.replace("/onboarding/profile")
          }
        }
      }
    }, [error, isLoading, router, user])

    if (error) return onError(error)
    if (user) return <Component user={user} {...props} />

    return onRedirecting()
  }
}

export default withPageAuthRequired
