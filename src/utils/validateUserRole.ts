import { NextApiResponse } from "next"

// Hard coding values for now
// const Prospect = "Prospect"
// const Client = "Client"
const Redirect = "client-desktop"
const RedirectClientTo = "https://clientfedev.tfoco.dev/client"
export default function validateUserRole(
  res: NextApiResponse,
  roles: string[],
) {
  console.log(roles)
  if (roles.includes(Redirect)) {
    res.redirect(RedirectClientTo)
  } else {
    res.redirect("/")
  }
}
