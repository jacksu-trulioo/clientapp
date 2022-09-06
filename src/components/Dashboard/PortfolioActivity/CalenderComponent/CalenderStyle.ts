const DATEPICKER_ICON_STYLES = {
  pos: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
}

const CalenderStyle = {
  ".datepicker-input-wrapper": {
    color: "gray.800",
    ".react-datepicker__input-container": {
      input: {
        height: "40px",
        width: "100%",
        cursor: "pointer",
        borderRadius: "2px",
      },
      "input:focus": {
        outline: "1px solid #B99855 !important",
      },
    },
  },
  ".datepicker-popper": {
    width: "100%",
    ".react-datepicker": {
      bg: "gray.800",
      fontFamily: "Gotham, sans-serif",
      borderRadius: "2",
      boxShadow: "0px 0px 22px rgb(0 0 0 / 75%)",
      width: "100%",
      border: "unset",
      d: "flex",
      flexDirection: "column",
      ".react-datepicker__month-container": {
        width: "100%",
        ".react-datepicker__month": {
          ".react-datepicker__week": {
            display: "flex",
            justifyContent: "space-around",
            ".react-datepicker__day": {
              color: "contrast.200",
              margin: "0.5rem 0",
              position: "relative",
              width: "8",
              height: "8",
              lineHeight: "8",
              borderRadius: "50%",
              outline: "none",
            },
            ".react-datepicker__day:hover": {
              borderRadius: "50%",
              bg: "pineapple.600",
              borderColor: "primary.500",
            },
            ".react-datepicker__day--selected": {
              borderRadius: "50%",
              bg: "none",
              color: "contrast.200",
            },
            ".react-datepicker__day--disabled": {
              color: "#4D4D4D !important",
              fontWeight: "400",
              cursor: "not-allowed",
              backgroundColor: "inherit",
              border: "none",
              background: "none",
            },
            ".react-datepicker__day--distribution": {
              bg: "#7bad1f !important",
              color: "#222222 !important",
              fontWeight: "700",
              border: "none !important",
            },
            ".react-datepicker__day--capital-calls": {
              bg: "#F7B198 !important",
              color: "#222222 !important",
              fontWeight: "700",
              border: "none !important",
            },
            ".react-datepicker__day--exits": {
              bg: "#8791E4 !important",
              color: "#222222 !important",
              fontWeight: "700",
              border: "none !important",
            },
            ".react-datepicker__day--keyboard-selected": {
              bg: "none",
            },
            ".react-datepicker__day--today": {
              bg: "transparent",
              border: "2px solid #FFFFFF",
              color: "contrast.200",
            },
            ".react-datepicker__day--selected.react-datepicker__day--today": {
              color: "contrast.200",
            },
            ".react-datepicker__day--outside-month": {
              color: "transparent",
              pointerEvents: "none",
              visibility: "hidden",
            },
            ".react-datepicker__day--distribution.react-datepicker__day--exits":
              {
                background:
                  "linear-gradient(to right, #7bad1f, #8791E4) !important",
              },
            ".react-datepicker__day--distribution.react-datepicker__day--capital-calls":
              {
                background:
                  "linear-gradient(to right, #7bad1f, #F7B198) !important",
              },
            ".react-datepicker__day--capital-calls.react-datepicker__day--exits":
              {
                background:
                  "linear-gradient(to right, #F7B198, #8791E4) !important",
              },

            ".react-datepicker__day--capital-calls.react-datepicker__day--distribution.react-datepicker__day--exits":
              {
                bg: "linear-gradient(to right, #F7B198, #7bad1f, #8791E4) !important",
                color: "gray.800 !important",
                fontWeight: "700",
              },

            ".react-datepicker__day--distribution.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },
            ".react-datepicker__day--capital-calls.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },
            ".react-datepicker__day--exits.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },

            ".react-datepicker__day--distribution.react-datepicker__day--exits.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },
            ".react-datepicker__day--distribution.react-datepicker__day--capital-calls.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },

            ".react-datepicker__day--capital-calls.react-datepicker__day--exits.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },

            ".react-datepicker__day--capital-calls.react-datepicker__day--distribution.react-datepicker__day--exits.react-datepicker__day--outside-month":
              {
                bg: "none !important",
              },

            ".react-datepicker__day--disabled.react-datepicker__day--distribution":
              {
                borderRadius: "32px",
                border: "1px solid #4d4d4d",
                background: "#313131 !important",
                color: "#828282 !important",
                fontWeight: "700 !important",
              },

            ".react-datepicker__day--disabled.react-datepicker__day--capital-calls":
              {
                borderRadius: "32px",
                border: "1px solid #4d4d4d",
                background: "#313131 !important",
                color: "#828282 !important",
                fontWeight: "700 !important",
              },
            ".react-datepicker__day--disabled.react-datepicker__day--exits": {
              borderRadius: "32px",
              border: "1px solid #4d4d4d",
              background: "#313131 !important",
              color: "#828282 !important",
              fontWeight: "700 !important",
            },

            ".react-datepicker__day--capital-calls.react-datepicker__day--distribution.react-datepicker__day--exits.react-datepicker__day--disabled":
              {
                borderRadius: "32px",
                border: "1px solid #4d4d4d",
                background: "#313131 !important",
                color: "#828282 !important",
                fontWeight: "700 !important",
              },

            ".react-datepicker__day--capital-calls.react-datepicker__day--distribution.react-datepicker__day--disabled":
              {
                borderRadius: "32px",
                border: "1px solid #4d4d4d",
                background: "#313131 !important",
                color: "#828282 !important",
                fontWeight: "700 !important",
              },

            ".react-datepicker__day--capital-calls.react-datepicker__day--exits.react-datepicker__day--disabled":
              {
                borderRadius: "32px",
                border: "1px solid #4d4d4d",
                background: "#313131 !important",
                color: "#828282 !important",
                fontWeight: "700 !important",
              },

            ".react-datepicker__day--distribution.react-datepicker__day--exits.react-datepicker__day--disabled":
              {
                borderRadius: "32px",
                border: "1px solid #4d4d4d",
                background: "#313131 !important",
                color: "#828282 !important",
                fontWeight: "700 !important",
              },

            ".react-datepicker__day--highlighted": {
              borderRadius: "50%",
              bg: "transparent",
              borderColor: "primary.500",
              color: "gray.400",
            },

            ".react-datepicker__day--selected.react-datepicker__day--highlighted":
              {
                borderRadius: "50%",
                bg: "primary.500",
                color: "gray.700",
                borderColor: "primary.500",
              },
          },
        },
        ".react-datepicker__header": {
          bg: "gray.800",
          color: "gray.200",
          border: "none",
          borderRadius: "unset",
          ".react-datepicker__current-month": {
            color: "gray.200",
            fontWeight: "normal",
            p: "2",
          },
          ".react-datepicker__day-names": {
            display: "flex",
            justifyContent: "space-around",
            ".react-datepicker__day-name": {
              color: "gray.500",
              margin: "0.5rem 0",
              height: "8",
              width: "8",
            },
          },
        },
      },
      ".react-datepicker__triangle": {
        display: "none",
      },
      " .react-datepicker__navigation--next": {
        right: "0",
        left: "unset",
        margin: "12px 0px",
      },
      ".react-datepicker__navigation--previous": {
        left: "0",
        margin: "12px 0px",
      },
      ".react-datepicker__navigation-icon::before": {
        borderColor: "primary.500",
        borderWidth: "2px 2px 0 0",
      },
    },
    ".react-datepicker__header__dropdown ": {
      justifyContent: "space-around",
      display: "flex",
      margin: "0 15%",
    },
    ".react-datepicker__year-dropdown": {
      left: "51%",
    },

    ".react-datepicker__month-dropdown , .react-datepicker__year-dropdown": {
      backgroundColor: "gray.800",
      fontFamily: "Gotham",
      color: "primary.500",
      fontSize: "16px",
      width: "max-content",
      margin: "10px 0",
      zIndex: 1,
      textAlign: "left",
      lineHeight: "24px",
      borderWidth: "1px ",
      borderStyle: "solid",
      borderColor: "primary.500",
      borderRadius: "2px",
      ".react-datepicker__month-option": {
        lineHeight: "24px",
      },
      ".react-datepicker__month-option--selected_month, .react-datepicker__year-option--selected_year":
        {
          backgroundColor: "pineapple.600",
        },
    },
    ".react-datepicker__year-dropdown--scrollable": {
      maxHeight: "350px",
      height: "fit-content",
    },
    ".react-datepicker__year-option, .react-datepicker__month-option,.react-datepicker__month-year-option":
      {
        padding: "0 20px 0px 20px",
        borderRadius: "none",
        whiteSpace: "nowrap",
      },

    " .react-datepicker__year-option:hover, .react-datepicker__month-option:hover":
      {
        backgroundColor: "pineapple.600",
      },
    ".react-datepicker__year-option--selected, .react-datepicker__month-option--selected":
      { display: "none" },

    ".react-datepicker__month-select:focus-visible": {
      outline: "none",
    },
  },
  ".datepicker-error": {
    ".react-datepicker__input-container": {
      input: {
        borderColor: "red.400",
        boxShadow: `0 0 0 1px #FC8181`,
      },
    },
  },
  ".read-only": {
    ".react-datepicker__month-container": {
      pointerEvents: "none",
    },
  },
  ".datepicker-mobileview": {
    pos: "relative",
    ".datepicker-icon": DATEPICKER_ICON_STYLES,
    ".react-datepicker__day": {
      margin: "9px 6px !important",
    },
    ".react-datepicker__day-name": {
      margin: "9px 6px !important",
    },
    ".react-datepicker__day--disabled": {
      backgroundColor: "inherit",
      border: "none",
      background: "none !important",
    },
  },

  ".datepicker-tabview": {
    ".datepicker-popper": {
      width: "100%",
    },
  },
  ".datepicker-webview": {
    pos: "relative",
    ".datepicker-icon": DATEPICKER_ICON_STYLES,
    ".datePicker-disabled": {
      cursor: "not-allowed !important",
      opacity: ".3",
    },
  },
}
export default CalenderStyle
