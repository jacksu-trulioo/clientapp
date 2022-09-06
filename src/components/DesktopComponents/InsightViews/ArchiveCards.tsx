import { Box, Heading, Image, Text } from "@chakra-ui/react"
import React from "react"

import { PlayPrimaryIcon } from "~/components"

interface ArchiveProps {
  imageMinHeight?: string
  cardImage: string
  tag: string
  title: string
  description: string
  showVideoIcon?: boolean
}

const ArchiveCard = ({
  cardImage,
  tag,
  title,
  description,
  showVideoIcon,
}: ArchiveProps) => {
  return (
    <Box mb={{ base: "10px", lgp: "32px" }} cursor={"pointer"}>
      <Box
        className="archiveBox"
        _hover={{
          "& #title": {
            color: "gray.400",
          },
          "& #imageOverlay": {
            bgGradient:
              "linear-gradient(118.19deg, rgba(26, 26, 26, 0.8) 5%, rgba(26, 26, 26, 0) 100%)",
          },
          "& #estimatedDuration": {
            color: "gray.500",
          },
        }}
      >
        <Box>
          <Box w="100%" overflow="hidden" position="relative" mb="24px">
            <Box pt="56.2%" />
            <Image
              src={cardImage}
              borderRadius="8px"
              alt="Post Image"
              position="absolute"
              inset="0"
              boxSizing="border-box"
              p="0"
              border="none"
              margin="auto"
              d="block"
              w="0px"
              h="0px"
              minWidth="100%"
              maxWidth="100%"
              minHeight="100%"
              maxHeight="100%"
              objectFit="cover"
            />
            <Box
              aria-label={tag}
              role={"article"}
              position="absolute"
              id="imageOverlay"
              w="full"
              h="full"
              top="0"
              zIndex="1"
            />
          </Box>
          <Box>
            <Box
              fontSize="12px"
              mb="8px"
              fontWeight="600"
              d="flex"
              alignItems="center"
            >
              {showVideoIcon ? (
                <PlayPrimaryIcon color="primary.500" mr="8px" />
              ) : (
                false
              )}

              <Text color="#A5D2DC">{tag}</Text>
            </Box>
            <Heading
              color="contrast.200"
              fontSize={{ base: "16px", md: "18px" }}
              fontWeight="400"
              noOfLines={1}
            >
              {title}
            </Heading>
          </Box>
          <Box mt="24px">
            <Text
              fontFamily="'Gotham'"
              color="gray.400"
              fontSize="12px"
              fontWeight="400"
            >
              {description}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ArchiveCard
