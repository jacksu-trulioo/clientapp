import {
  Box,
  FormLabel,
  IconButton,
  InputGroup,
  InputGroupProps,
  InputRightElement,
  List,
  ListItem,
} from "@chakra-ui/react"
import { useCombobox, UseComboboxProps } from "downshift"
import * as React from "react"

import { CaretDownIcon, InputControl } from "~/components"

export type AutocompleteItem = {
  label: string
  value: string
}

export interface AutocompleteProps<T extends AutocompleteItem>
  extends UseComboboxProps<T> {
  name: string
  label?: string
  items: T[]
  placeholder: string
  inputGroupProps?: InputGroupProps
  onSelected: (item: T) => void
}

function Autocomplete<T extends AutocompleteItem>(props: AutocompleteProps<T>) {
  const { label, items, name, placeholder, onSelected, inputGroupProps } = props

  const itemToString = (item: T | null) => (item ? item.label : "")
  const [inputItems, setInputItems] = React.useState(items)
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
  } = useCombobox({
    items: inputItems,
    itemToString,
    selectedItem: props.selectedItem,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return

      onSelected(selectedItem)
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) =>
          itemToString(item)
            .toLowerCase()
            .startsWith(inputValue ? inputValue.toLowerCase() : ""),
        ),
      )
    },
  })

  return (
    <Box pos="relative">
      {label && <FormLabel {...getLabelProps()}>{label}</FormLabel>}

      <div {...getComboboxProps()}>
        <InputGroup {...inputGroupProps}>
          <InputControl
            name={name}
            inputProps={{
              ...getInputProps(),
              placeholder,
            }}
          />
          <InputRightElement>
            <IconButton
              variant="ghost"
              colorScheme="primary"
              {...getToggleButtonProps()}
            >
              <CaretDownIcon h="6" w="6" />
            </IconButton>
          </InputRightElement>
        </InputGroup>
      </div>

      <List
        pos="absolute"
        left="0"
        right="0"
        bg="gray.700"
        zIndex="3"
        maxH="200px"
        overflowY="scroll"
        textAlign="start"
        {...getMenuProps()}
      >
        {isOpen &&
          inputItems.map((item, index) => {
            return (
              <ListItem
                key={`${item.value}-${index}`}
                bg={highlightedIndex === index ? "gray.800" : "inherit"}
                px="4"
                py="2"
                _hover={{
                  bg: "gray.800",
                  cursor: "pointer",
                }}
                {...getItemProps({
                  item,
                  index,
                })}
              >
                {item.label}
              </ListItem>
            )
          })}
      </List>
    </Box>
  )
}

export default Autocomplete
