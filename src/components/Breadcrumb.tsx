import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"

import { Link } from "~/components"

const TFOBreadcrumb = () => {
  const router = useRouter()
  const { t } = useTranslation("common")
  const isMobileView = useBreakpointValue({ base: true, md: false })

  // need to slice because of initial "/" in the path
  const paths = router.asPath.split("/").slice(1)

  return (
    <>
      <ChakraBreadcrumb my="3" color="gray.400">
        {paths.map((path, index) => (
          <BreadcrumbItem
            key={path}
            isCurrentPage={paths[paths.length - 1] === path}
          >
            <BreadcrumbLink
              as={Link}
              href={`/${paths.slice(0, index + 1).join("/")}`}
              fontSize="xs"
              textDecoration="underline"
              _activeLink={{
                textDecoration: "none",
                cursor: "default",
                color: "gray.600",
                _hover: {
                  textDecoration: "none",
                },
              }}
            >
              {t(`common:breadcrumb.${path}`)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </ChakraBreadcrumb>
      {isMobileView && <Divider borderColor="gray.800" border="1px solid" />}
    </>
  )
}

export default TFOBreadcrumb
