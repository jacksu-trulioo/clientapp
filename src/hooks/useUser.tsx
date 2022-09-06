import { useRouter } from "next/router"
import React, { Fragment, useState } from "react"
import { IdleTimerProvider } from "react-idle-timer"
import useSWR from "swr"

import { SessionExpireModal } from "~/components"
import { User } from "~/services/mytfo/types"
import { REDIRECT_ROLE } from "~/utils/constants/redirectPath"
import { isMinimumProfileCompleted } from "~/utils/isMinimumProfileCompleted"

export type UserContext = {
  user?: User
  error?: Error
  isLoading: boolean
}

export type UserProviderProps = React.PropsWithChildren<{
  user?: User
}>

const missingUserProvider = "You forgot to wrap your app in <UserProvider>"

export const UserContext = React.createContext<UserContext>({
  get user(): never {
    throw new Error(missingUserProvider)
  },
  get error(): never {
    throw new Error(missingUserProvider)
  },
  get isLoading(): never {
    throw new Error(missingUserProvider)
  },
})

/**
 * The `useUser` hook, which will get you the {@link User} object from the server-side session.
 */
export type UseUser = () => UserContext

export const useUser: UseUser = () => React.useContext<UserContext>(UserContext)

export type UserProvider = (
  props: UserProviderProps,
) => React.ReactElement<UserContext>

const onboardingRedirectUrl = "/onboarding/profile"
const publicApiRoutes = [
  "/login",
  "/signup",
  "/verify-response",
  "/password/change",
  "/password/forgot",
  "/invite",
]

function UserProvider({
  children,
}: UserProviderProps): React.ReactElement<UserContext> {
  const router = useRouter()
  const idleTimeout: number =
    Number(process.env.NEXT_PUBLIC_USER_IDLE_TIMER) || 960000

  const isTracker =
    process.env.NEXT_PUBLIC_ENABLED_USER_IDLE_TRACKER === "true" ? true : false
  const [IsSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [logoutTimer, setLogoutTimer] = useState(60)

  const shouldFetch = !publicApiRoutes.some((path) =>
    router.asPath?.includes(path),
  )

  const { data: user, error } = useSWR<User>(shouldFetch ? "/api/user" : null)

  const isLoading = !user && !error

  // Redirect user through onboarding if incomplete.
  React.useEffect(() => {
    if (router.asPath === onboardingRedirectUrl) return

    if (
      !user?.roles?.includes(REDIRECT_ROLE) &&
      !user?.profile &&
      user?.emailVerified
    ) {
      router.replace(onboardingRedirectUrl)
    }

    if (!user?.roles?.includes(REDIRECT_ROLE) && user?.profile) {
      if (!isMinimumProfileCompleted(user.profile)) {
        router.replace(onboardingRedirectUrl)
      }
    }
  }, [router, user])

  const handleIdle = () => {
    if (isTracker && shouldFetch && user?.mandateId) {
      setIsSessionModalOpen(true)
      setLogoutTimer(60)
    } else {
      setIsSessionModalOpen(false)
    }
  }

  return (
    <Fragment>
      <UserContext.Provider value={{ user, error, isLoading }}>
        {user?.mandateId ? (
          <IdleTimerProvider timeout={idleTimeout} onIdle={handleIdle}>
            {children}
          </IdleTimerProvider>
        ) : (
          children
        )}
      </UserContext.Provider>
      {IsSessionModalOpen ? (
        <SessionExpireModal
          timer={logoutTimer}
          isOpen={IsSessionModalOpen}
          onClose={() => {
            setIsSessionModalOpen(false)
          }}
        />
      ) : (
        false
      )}
    </Fragment>
  )
}

export default UserProvider
