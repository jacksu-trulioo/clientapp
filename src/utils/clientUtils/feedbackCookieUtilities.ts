import siteConfig from "~/config"

export const getFeedbackCookieStatus = (cookieName: string) => {
  let name = cookieName + "="
  let decodedCookie = decodeURIComponent(document.cookie)
  let cookies = decodedCookie.split(";")
  let cookieValue = ""
  cookies.forEach((c) => {
    while (c.charAt(0) == " ") {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      cookieValue = c.substring(name.length, c.length)
    }
  })

  if (!cookieValue) {
    setFeedbackCookieStatus(
      cookieName,
      true,
      siteConfig.clientFeedbackSessionExpireDays,
    )
    cookieValue = "true"
  }

  return cookieValue
}

export const setFeedbackCookieStatus = (
  cookieName: string,
  cookieValue: string | boolean | number,
  cookieExpireDays: number,
) => {
  const d = new Date()
  d.setTime(d.getTime() + cookieExpireDays * 24 * 60 * 60 * 1000)
  let expires = "expires=" + d.toUTCString()
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/"
}
