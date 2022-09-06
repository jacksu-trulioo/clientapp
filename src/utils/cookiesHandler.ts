export const getCookie = (cookieName: string) => {
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

  return cookieValue
}
