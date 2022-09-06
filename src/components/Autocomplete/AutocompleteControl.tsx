import { useField } from "formik"
import { useCallback } from "react"

import AutoComplete, {
  AutocompleteItem,
  AutocompleteProps,
} from "./Autocomplete"

type AutoCompleteControlProps<Item extends AutocompleteItem> = Omit<
  AutocompleteProps<Item>,
  "onSelected" | "inputValue"
> & {
  validateOnSelected?: boolean
  valueExtractor: (item: Item) => unknown
}

function defaultValueExtractor<Item extends AutocompleteItem>(item: Item) {
  return item
}

function AutoCompleteControl<Item extends AutocompleteItem>({
  valueExtractor = defaultValueExtractor,
  validateOnSelected,
  ...props
}: AutoCompleteControlProps<Item>) {
  const [{ value }, , { setValue }] = useField(props.name)

  const onSelected = useCallback(
    (item: Item) => {
      setValue(valueExtractor(item), validateOnSelected)
    },
    [setValue, valueExtractor, validateOnSelected],
  )

  const selected = props.items.find((item) => valueExtractor(item) === value)

  return (
    <AutoComplete
      inputValue={value}
      onSelected={onSelected}
      selectedItem={selected}
      {...props}
    />
  )
}

AutoCompleteControl.displayName = "AutoCompleteControl"

export default AutoCompleteControl
