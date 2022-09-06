import { Button } from "@chakra-ui/button"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import withFormik from "storybook-formik"
import * as Yup from "yup"

import { Form, InputControl } from "~/components"

const FormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2)
    .max(128)
    .required(
      "Field may not be less than 2 letters or include numeric values/symbols.",
    ),
  email: Yup.string()
    .required('Must include the "@" symbol and valid domain (e.g. .com, .net).')
    .email('Must include the "@" symbol and valid domain (e.g. .com, .net).'),
})

type FormDataType = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export default {
  decorators: [withFormik],
  title: "Experiments/Form",
  component: Form,
  parameters: {
    formik: {
      initialValues: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
      },
      validationSchema: FormSchema,
      onSubmit: (v: FormDataType) => console.log("I want to log these... ", v),
    },
  },
} as ComponentMeta<typeof Form>

const Template: ComponentStory<typeof Form> = (args) => {
  return <Form {...args} />
}

export const Default = Template.bind({})
Default.args = {
  children: (
    <>
      <InputControl
        name="firstName"
        label="First Name"
        inputProps={{
          type: "text",
          placeholder: "Your first name",
        }}
      />
      <InputControl
        name="lastName"
        label="Last Name"
        inputProps={{
          type: "text",
          placeholder: "Your last name",
        }}
      />
      <InputControl
        name="phoneNumber"
        label="Phone Number"
        inputProps={{
          type: "phone",
          placeholder: "Your phone number",
        }}
      />
      <InputControl
        name="email"
        label="Email"
        inputProps={{
          type: "email",
          placeholder: "Your email",
        }}
      />
      <Button
        role="button"
        colorScheme="primary"
        loadingText="Saving..."
        type="submit"
        mb="2"
        isLoading={false}
        disabled={false}
      >
        Save
      </Button>
    </>
  ),
}
