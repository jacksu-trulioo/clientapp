import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import dynamic from "next/dynamic"
import useTranslation from "next-translate/useTranslation"
import React, { Fragment } from "react"

import { CloseIcon } from "~/components"

const PdfViewer = dynamic(() => import("~/components/MyDocument/PdfViewer"), {
  ssr: false,
})

type PDFURLType = {
  pdfURL?: string
  show: boolean
  close: () => void
}

export function PdfModelBox({ pdfURL, show, close }: PDFURLType) {
  const { t } = useTranslation("documentCenter")
  const { onClose } = useDisclosure()

  return (
    <Fragment>
      <Modal isOpen={show} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent minH="auto" h="100%">
          <ModalHeader p="0" m="0">
            <Box
              p="14px"
              bg="#222222"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Icon
                width="114px"
                height="50px"
                viewBox="0 0 75 33"
                py="4px"
                fill="none"
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M9.95204 29.2515V29.5784C6.62756 30.173 2.59737 31.8414 1.37766
                         33H0.107011C1.65047 30.9166 5.85492 29.0604 9.95204 29.2515ZM9.95204 31.0722V31.5783C9.54516
                         31.6873 9.11492 31.8117 8.69166 31.9428L8.48074 32.0089C7.39548 32.353 6.39044 32.7328 5.98845
                         33H3.40615C5.21794 31.9797 7.5957 31.1241 9.95204 31.0722ZM10.0543 27.6041C5.31301 28.3702 1.96156
                         29.6077 0 31.3169V30.1687C1.02523 29.1435 5.35453 26.7313 10.0543 27.6041ZM9.34347 25.7757C5.21049
                         26.252 2.096 27.1614 0 28.5037V27.3946C3.11449 25.6323 6.22898 25.0927 9.34347 25.7757ZM8.73345
                         23.9864C5.30669 24.2065 2.39554 24.8697 0 25.976V24.8526C3.58176 23.4984 6.49291 23.2097 8.73345
                         23.9864ZM0.148447 0L9.95204 20.3488V24.3114L0 0.535494V0H0.148447ZM7.90127 22.1411C4.64379 22.3265
                         2.01003 22.7999 0 23.561V22.4704C3.2315 21.4786 5.86525 21.3688 7.90127 22.1411ZM7.21894 20.3948C4.25856
                         20.3948 1.85225 20.7298 0 21.3997V20.2786C2.90749 19.6216 5.3138 19.6603 7.21894 20.3948ZM6.4876 18.5975C4.32507
                         18.4383 2.16253 18.61 0 19.1125V18.0862C2.75766 17.7004 4.9202 17.8708 6.4876 18.5975ZM5.80933 16.8029C3.63387
                         16.5869 1.69743 16.6526 0 17.0001V16.0574C2.37736 15.7974 4.3138 16.0459 5.80933 16.8029ZM9.95204
                         14.7816V15.4076C9.68167 15.5832 9.46848 15.7671 9.31245 15.9596C9.31245 15.6555 9.59294 15.1088 9.95204
                         14.7816ZM5.06278 15.0024C3.01287 14.7987 1.32527 14.7987 0 15.0024V14.0324C2.18681 13.9982 3.87441 14.3215
                         5.06278 15.0024ZM9.95204 11.888V12.83C9.30914 13.2298 8.77408 13.68 8.34687 14.1806C8.58218 13.3327 9.39958
                         12.2388 9.95204 11.888ZM0 12.1022C1.82187 12.1998 3.28156 12.6012 4.37907 13.3064C2.6697 12.9749 1.21001
                         12.8777 0 13.0149V12.1022ZM9.95204 8.9963V10.1744C9.00441 10.8025 8.14832 11.5293 7.38377 12.3547C7.6286
                         10.9774 9.31691 9.47699 9.95204 8.9963ZM0 10.2815C1.45233 10.4687 2.66077 10.8759 3.62532 11.5029C2.28423
                         11.196 1.07579 11.0716 0 11.1297V10.2815ZM9.95204 6.31883V7.49692C8.47899 8.5196 7.30186 9.53585 6.42067
                         10.5457C6.91249 8.38561 9.43529 6.58328 9.95204 6.31883ZM0 8.5679C1.22225 8.76222 2.19278 9.16571 2.91159
                         9.77836C1.85404 9.48828 0.883513 9.33424 0 9.31622V8.5679ZM9.95204 3.64136V4.81945C8.19939 5.97123 6.7369
                         7.27109 5.56458 8.71903C5.80152 6.46923 8.92203 4.1079 9.95204 3.64136ZM0 6.85432C1.00997 7.19248 1.73636
                         7.59303 2.17916 8.05598C1.35382 7.77819 0.627428 7.62282 0 7.58986V6.85432ZM9.95204 0.963889V2.14198C7.81399
                         3.43696 6.02372 5.05162 4.58123 6.98597C4.91034 4.03582 8.88023 1.48845 9.95204 0.963889ZM0 5.24784C0.695703
                         5.52708 1.18944 5.84814 1.48121 6.211C0.930126 6.00034 0.436388 5.87869 0 5.84605V5.24784ZM8.97402 0C6.76648
                         1.50449 4.99519 3.21343 3.66014 5.12681C3.84532 3.41787 5.01022 1.70894 7.15483 0H8.97402ZM0 3.64136C0.378754
                         3.84186 0.642198 4.05696 0.790331 4.28668C0.543852 4.16576 0.280408 4.08222 0 4.03605V3.64136ZM5.54966
                         0C4.44352 0.94325 3.48539 2.07338 2.67528 3.3904C2.70815 2.36276 3.16689 1.23263 4.05151 0H5.54966ZM2.78229
                         0C2.42559 0.452799 2.06888 0.988293 1.71218 1.60648C1.74684 0.940723 1.85385 0.405229 2.03321 0H2.78229Z"
                  fill="#B99855"
                ></path>
                <path
                  d="M22.7411 0.632676V6.22131H21.9882V0.632676H19.8369V0H25V0.632676H22.7411Z"
                  fill="white"
                ></path>
                <path
                  d="M34.5732 2.74159V0H35.3261V6.22131H34.5732V3.37427H30.916V6.22131H30.1631V0H30.916V2.74159H34.5732Z"
                  fill="white"
                ></path>
                <path
                  d="M20.1086 13.5247H24.7282V14.1573H20.8607V16.3717H24.2985V17.0044H20.8607V19.746H20.1086V13.5247Z"
                  fill="white"
                ></path>
                <path
                  d="M31.25 26.7783H35.8696V27.411H32.002V29.6254H35.4398V30.258H32.002V32.9996H31.25V26.7783Z"
                  fill="white"
                ></path>
                <path
                  d="M41.8479 26.7783H46.4675V27.411H42.5999V29.6254H46.0377V30.258H42.5999V32.9996H41.8479V26.7783Z"
                  fill="white"
                ></path>
                <path
                  d="M34.3166 17.4262L32.8331 14.229L31.4045 17.4262H34.3166ZM34.6101 18.0588H31.1219L30.368 19.746H29.6196L32.3994 13.5247H33.2547L36.1414 19.746H35.393L34.6101 18.0588Z"
                  fill="white"
                ></path>
                <path
                  d="M41.8479 0H46.3625V0.632676H42.5828V2.74159H45.9425V3.37427H42.5828V5.58864H46.4675V6.22131H41.8479V0Z"
                  fill="white"
                ></path>
                <path
                  d="M69.5652 26.7783H74.0798V27.411H70.3001V29.5199H73.6598V30.1526H70.3001V32.367H74.1848V32.9996H69.5652V26.7783Z"
                  fill="white"
                ></path>
                <path
                  d="M60.525 19.1133H64.1305V19.746H59.7827V13.5247H60.525V19.1133Z"
                  fill="white"
                ></path>
                <path
                  d="M22.2826 32.9996C20.4817 32.9996 19.0217 31.5464 19.0217 29.7537C19.0217 27.9611 20.4817 26.5078 22.2826 26.5078C24.0835 26.5078 25.5435 27.9611 25.5435 29.7537C25.5435 31.5464 24.0835 32.9996 22.2826 32.9996ZM22.2826 32.3611C23.6633 32.3611 24.7826 31.2175 24.7826 29.8069C24.7826 28.3963 23.6633 27.2528 22.2826 27.2528C20.9019 27.2528 19.7826 28.3963 19.7826 29.8069C19.7826 31.2175 20.9019 32.3611 22.2826 32.3611Z"
                  fill="white"
                ></path>
                <path
                  d="M64.6334 27.5238L64.058 28.0917C63.5069 27.5764 62.7441 27.2528 61.9998 27.2528C60.6008 27.2528 59.4666 28.3963 59.4666 29.8069C59.4666 31.2175 60.6008 32.3611 61.9998 32.3611C62.7818 32.3611 63.5842 32.0039 64.14 31.4425L64.6738 31.9478C63.9538 32.5943 62.9636 32.9996 61.9998 32.9996C60.1749 32.9996 58.6956 31.5464 58.6956 29.7537C58.6956 27.9611 60.1749 26.5078 61.9998 26.5078C62.9457 26.5078 63.917 26.8982 64.6334 27.5238Z"
                  fill="white"
                ></path>
                <path
                  d="M52.7173 13.5247H53.5325V19.746H52.7173V13.5247Z"
                  fill="white"
                ></path>
                <path
                  d="M52.7173 26.7783H53.5325V32.9996H52.7173V26.7783Z"
                  fill="white"
                ></path>
                <path
                  d="M72.3779 17.3207V19.746H71.6438V17.3207L69.0217 13.5247H69.9657L72.0109 16.5668L74.0561 13.5247H75L72.3779 17.3207Z"
                  fill="white"
                ></path>
                <path
                  d="M46.2768 13.5388V13.5247H47.011V19.746H46.2768V14.7958L44.0743 18.0679L41.7669 14.7013V19.746H41.0327V13.5247H41.7669V13.5368L41.8622 13.5247L44.0377 16.8432L46.2768 13.5388Z"
                  fill="white"
                ></path>
              </Icon>
              <Button
                aria-label="Close"
                fontSize="16px"
                bg="transparent"
                color="#B99855"
                _active={{ bg: "transparent" }}
                _hover={{ bg: "transparent" }}
                _focus={{ boxShadow: "none" }}
                onClick={close}
              >
                {t("labels.close")} <CloseIcon w="16px" h="16px" />
              </Button>
            </Box>
          </ModalHeader>
          <ModalBody p="0" overflow="auto">
            <PdfViewer isPdfURL={pdfURL} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  )
}
export default PdfModelBox
