export const downloadBlob = async (url: string, fileName?: string) => {
  let link = document.createElement("a")
  link.href = url
  link.download = fileName ? fileName : "download"
  link.click()
  link.remove()
}
