import { GlobalStyleProps, mode } from "@chakra-ui/theme-tools"

import CalenderStyle from "~/components/Dashboard/PortfolioActivity/CalenderComponent/CalenderStyle"
import DatepickerStyles from "~/components/DatePicker/DatePickerStyles"

// Global style overrides.
const styles = {
  global: (props: GlobalStyleProps) => {
    return {
      html: {
        height: "100%",
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
      main: {
        flex: "1 0 auto",
      },
      // Scrollbars.
      "*::-webkit-scrollbar": {
        width: "10px",
        height: "10px",
      },
      "*::-webkit-scrollbar-track": {
        background: "#333",
      },
      "::-webkit-scrollbar-thumb": {
        background: "gray.850",
      },
      "::-webkit-scrollbar-corner": {
        background: "transparent",
      },
      // input placeholder style
      "::-webkit-input-placeholder": {
        color: "gray.500",
        overflow: "visible",
      },
      body: {
        height: "100%",
        color: mode("gray.700", "whiteAlpha.900")(props),
        background: mode("white", "gray.900")(props),
        lineHeight: props?.theme?.direction === "rtl" ? 1.5 : 1.2,
      },
      a: {
        color: "primary.500",
        textDecoration: "underline",
      },
      // Used to flex ModalFooter style.
      ".chakra-portal": {
        display: "flex",
        flex: 1,
      },
      ".tfo-datepicker": {
        ".datepicker-input-wrapper":
          DatepickerStyles[".datepicker-input-wrapper"],
        ".datepicker-popper": DatepickerStyles[".datepicker-popper"],
        ".read-only": DatepickerStyles[".read-only"],
        ".react-datepicker":
          DatepickerStyles[".datepicker-popper"][".react-datepicker"],
      },
      ".datepicker-error": DatepickerStyles[".datepicker-error"],
      ".datepicker-mobileview": DatepickerStyles[".datepicker-mobileview"],
      ".datepicker-tabview": DatepickerStyles[".datepicker-tabview"],
      ".datepicker-webview": DatepickerStyles[".datepicker-webview"],
      ".read-only-datepicker": DatepickerStyles[".read-only"],
      ".tfo-datepicker-portfolio-activity": {
        ".datepicker-input-wrapper": CalenderStyle[".datepicker-input-wrapper"],
        ".datepicker-popper": CalenderStyle[".datepicker-popper"],
        ".read-only": CalenderStyle[".read-only"],
        ".react-datepicker":
          CalenderStyle[".datepicker-popper"][".react-datepicker"],
      },
      ".op-title": {
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "18px",
        lineHeight: "120%",
        color: "#fff",
        flex: "none",
        order: "0",
        flexGrow: "0",
      },
    }
  },
}

export default styles
