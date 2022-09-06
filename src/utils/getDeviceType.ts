export const getDeviceType = () => {
  const ua = navigator.userAgent

  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return "mobile"
  }

  if (
    /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) ||
    checkForIpad()
  ) {
    return "tablet"
  }

  return "desktop"
}

//For Safari Browser in Ipad
const checkForIpad = () => {
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
}
