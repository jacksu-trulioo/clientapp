import { Button } from "@chakra-ui/button"
import { Box, Heading } from "@chakra-ui/layout"
import { Flex, Hide } from "@chakra-ui/react"
import router from "next/router"
import useTranslation from "next-translate/useTranslation"

const PortfolioSimulatorWidget = () => {
  const { lang, t } = useTranslation("common")
  return (
    <Flex
      justifyContent="space-between"
      bg={"linear-gradient(98.19deg, #1B2123 27.48%, #283134 97.46%)"}
      borderRadius="6px"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gunmetal.850"
    >
      <Box
        textAlign={{ base: "center", md: "inherit" }}
        p={{ md: "37px 0px 38px 34px", base: "37px 38px 34px" }}
      >
        <Heading
          mb={5}
          color="contrast.200"
          fontWeight="normal"
          fontSize={{ base: "xl", md: "2xl" }}
        >
          {t("portfolioSimulatorWidget.title")}
        </Heading>
        <Button
          onClick={() => {
            router.push("/portfolio/simulator")
          }}
          role="button"
          colorScheme="primary"
          type="submit"
          m="0"
        >
          {t("portfolioSimulatorWidget.button.text")}
        </Button>
      </Box>
      <Hide below="md">
        <Box
          w={{ md: "100%", lg: "70%" }}
          bgRepeat="no-repeat"
          bgPosition="bottom right"
          bgSize="contain"
          bgImage={
            lang.includes("ar")
              ? "/images/portfolio-simulator-ar.svg"
              : "/images/portfolio-simulator.svg"
          }
        ></Box>
      </Hide>
    </Flex>
  )
}

export default PortfolioSimulatorWidget
