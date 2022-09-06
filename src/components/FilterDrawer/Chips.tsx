import { HStack, Tag, TagCloseButton, TagLabel, Text } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"

type ChipsPropsType = {
  data: ChipData[]
  onClear: () => void
  onClose: (value: string | number, index: number, key?: string) => void
}

type ChipData = {
  filter?: string
  label: string | number
  value: string | number
}

const Chips = ({ data, onClose, onClear }: ChipsPropsType) => {
  const { t } = useTranslation("common")
  return (
    <HStack spacing={4} style={{ flexWrap: "wrap", alignItems: "center" }}>
      {data.map(({ filter, label, value }, i) => (
        <Tag
          className="filterchips"
          aria-label="filterChip"
          role={"button"}
          size="sm"
          key={i}
          borderRadius="6px"
          variant="solid"
          backgroundColor="secondary.600"
          color="gray.800"
          fontSize="12px"
          cursor="pointer"
          style={{
            marginTop: "10px",
            marginInlineStart: "0",
            marginInlineEnd: "10px",
          }}
          onClick={() => onClose(value, i, filter!)}
        >
          <TagLabel>{label}</TagLabel>
          <TagCloseButton />
        </Tag>
      ))}
      <Text
        aria-label="Clear all filters"
        role={"button"}
        onClick={onClear}
        fontSize="12px"
        fontWeight="400"
        color="primary.500"
        cursor="pointer"
        style={{
          marginTop: "10px",
          marginInlineStart: "0",
          marginInlineEnd: "10px",
        }}
      >
        {t("filters.button.clearAllFilter")}
      </Text>
    </HStack>
  )
}

export default Chips
