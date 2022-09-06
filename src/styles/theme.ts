import { extendTheme, ThemeConfig } from "@chakra-ui/react"

import Accordion from "./components/Accordion.theme"
import Button from "./components/Button.theme"
import Checkbox from "./components/Checkbox.theme"
import CloseButton from "./components/CloseButton.theme"
import Divider from "./components/Divider.theme"
import FormError from "./components/FormError.theme"
import FormLabel from "./components/FormLabel.theme"
import Heading from "./components/Heading.theme"
import Input from "./components/Input.theme"
import Modal from "./components/Modal.theme"
import PinInput from "./components/PinInput.theme"
import Progress from "./components/Progress.theme"
import Radio from "./components/Radio.theme"
import Slider from "./components/Slider.theme"
import Table from "./components/Table.theme"
import Tabs from "./components/Tabs.theme"
import Textarea from "./components/Textarea.theme"
import Tooltip from "./components/Tooltip.theme"
import breakpoints from "./foundations/breakpoints"
import { colors } from "./foundations/colors"
import shadows from "./foundations/shadows"
import textStyles from "./foundations/textStyles"
import styles from "./styles"

const config: ThemeConfig = {
  initialColorMode: "dark",
}

const theme = extendTheme({
  config,
  fonts: {
    heading: "Gotham, sans-serif",
    body: "Gotham, sans-serif",
  },
  shadows,
  //set the global lineHeight as per TFO design system
  lineHeights: {
    base: 1.2,
  },
  border: {
    defaultBorder: "1px solid #4d4d4d",
  },
  colors,
  accordianStyles: {
    borderTopStartRadius16: "16px",
    borderBottomStartRadius16: "16px",
    borderStart8: "8px",
  },
  styles,
  breakpoints,
  textStyles,
  components: {
    Accordion,
    Button,
    Checkbox,
    CloseButton,
    FormLabel,
    FormError,
    Heading,
    Input,
    Progress,
    Radio,
    Slider,
    Tabs,
    Tooltip,
    Modal,
    Textarea,
    Table,
    PinInput,
    Divider,
  },
})

export default theme
