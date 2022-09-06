import useTranslation from "next-translate/useTranslation"

export default function RigthArrow() {
  const { lang } = useTranslation("setting")
  return (
    <svg
      style={{
        transform: lang.includes("ar") ? "rotate(180deg)" : "none",
      }}
      width="6"
      height="8"
      viewBox="0 0 6 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.63642 3.72852L0.666504 1.00617L1.51488 0.228516L5.33317 3.72852L1.51488 7.22852L0.666504 6.45086L3.63642 3.72852Z"
        fill="#B99855"
      />
    </svg>
  )
}
