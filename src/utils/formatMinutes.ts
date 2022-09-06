export default function formatMinutes(
  value: number | undefined,
  locale: string | undefined,
): string {
  if (locale === "ar") {
    if (!value) return ""
    if (value === 1) return "دقيقة"
    if (value === 2) return "دقيقتان"
    if (value >= 11) return value + " دقيقة "
    return value + " دقائق "
  } else {
    if (!value) return ""
    return value > 1 ? value + " mins" : value + " min"
  }
}
