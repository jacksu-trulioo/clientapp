import "react-widgets/styles.css"

import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"
import Combobox from "react-widgets/Combobox"

import { CaretDownIcon } from "~/components"

type ComboBoxType = {
  data: string[]
  initialValue: string
  onChangeHandler?: Function
  onSelectHandler?: Function
}

const ComboBox = ({
  data,
  initialValue,
  onChangeHandler,
  onSelectHandler,
}: ComboBoxType) => {
  const { t } = useTranslation("common")

  return (
    <Fragment>
      <Combobox
        onSelect={(value: string) => {
          if (onSelectHandler) {
            onSelectHandler(value)
          }
        }}
        onChange={(value: string) => {
          if (onChangeHandler) {
            onChangeHandler(value)
          }
        }}
        data={data}
        dataKey="id"
        textField="name"
        defaultValue={initialValue}
        selectIcon={<CaretDownIcon />}
        messages={{
          emptyFilter: t("select.noOptions"),
        }}
        placeholder={initialValue}
      />
    </Fragment>
  )
}

export default ComboBox
