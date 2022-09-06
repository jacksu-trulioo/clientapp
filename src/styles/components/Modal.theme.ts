const Modal = {
  baseStyle: () => {
    return {
      dialog: {
        backgroundColor: "gray.900",
        border: "1px",
        borderColor: "gray.700",
      },
      header: {
        color: "white",
        fontSize: "lg",
        marginTop: 12,
        textAlign: "center",
      },
      body: {
        fontSize: "md",
        textAlign: "center",
        color: "gray.400",
      },
      closeButton: {
        color: "primary.500",
      },
      footer: {
        justifyContent: "center",
        flexDirection: "column",
      },
      overlay: {
        backdropFilter: "blur(8px)",
      },
    }
  },
}

export default Modal
