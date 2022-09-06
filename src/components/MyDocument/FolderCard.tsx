import { Box } from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { FolderDocIcon, Link } from "~/components"

type Props = {
  counter: number
  title: string
}

export default function FolderCard({ counter, title }: Props) {
  const { t } = useTranslation("documentCenter")

  return (
    <Link
      href={`/client/my-documents/${title}`}
      d="block"
      w={{ base: "49%", md: "160px", lgp: "178px" }}
      minH={{ base: "146px", md: "146px", lgp: "152px" }}
      textAlign="center"
      p={{ base: "16px", md: "16px", lgp: "16px" }}
      bgColor="gray.800"
      boxShadow="0 0 24px rgb(0 0 0 / 75%)"
      borderRadius="2px"
      mb="5px"
      cursor="pointer"
      outline="none"
      textDecor="none"
      _hover={{
        textDecor: "none",
      }}
      _focus={{
        boxShadow: "0 0 24px rgb(0 0 0 / 75%)",
      }}
    >
      <Box>
        <Box
          aria-label="no of files"
          role={"heading"}
          textAlign="right"
          fontSize="14px"
          fontWeight="700"
          color="#fff"
        >
          {counter}
        </Box>
        <Box display="inline-block" pb="28px">
          <FolderDocIcon />
        </Box>
        <Box color="#fff" fontStyle="normal" fontWeight="700" fontSize="14px">
          <Box
            aria-label="folder name"
            role={"cell"}
            fontWeight="700"
            fontSize="14px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            lineHeight="120%"
            pb="24px"
          >
            {t(`folder.${title.replace(" ", "_").toLowerCase()}`)}
          </Box>
        </Box>
      </Box>
    </Link>
  )
}
