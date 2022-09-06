import { Profile } from "~/services/mytfo/types"

export function isMinimumProfileCompleted(
  profile: Profile | undefined,
): boolean {
  return !!(
    profile?.firstName &&
    profile?.lastName &&
    profile?.countryOfResidence &&
    profile?.phoneCountryCode &&
    profile?.phoneNumber
  )
}
