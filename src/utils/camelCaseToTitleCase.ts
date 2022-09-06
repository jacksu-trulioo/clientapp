export default function camelCaseToTitleCase(input: string) {
  return (
    input
      // Insert a space before all caps.
      .replace(/([A-Z])/g, " $1")
      // Uppercase the first character.
      .replace(/^./, function (str) {
        return str.toUpperCase()
      })
  )
}
