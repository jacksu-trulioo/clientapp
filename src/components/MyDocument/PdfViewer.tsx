import { Box } from "@chakra-ui/layout"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

import { DownloadDocs } from "~/services/mytfo/types"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const styles = {
  body: {
    backgroundColor: "#121212",
    display: "flex",
    justifyContent: "center",
  },
}

type PDFURLType = {
  isPdfURL?: string
}

export default function PDFViewer({ isPdfURL }: PDFURLType) {
  const { t } = useTranslation("documentCenter")
  const [file, setFile] = useState<DownloadDocs["url"]>()
  const [numPages, setNumPages] = useState(Number)
  const [fileError, setFileError] = useState(false)

  useEffect(() => {
    if (isPdfURL) {
      setFile(isPdfURL)
    }
  }, [isPdfURL])

  type props = {
    numPages?: number
    nextNumPages?: number
  }

  function onDocumentLoadSuccess({ numPages }: props) {
    setNumPages(numPages || 0)
    setFileError(false)
  }

  function onDocLoadError() {
    setFileError(true)
  }

  return (
    <div
      style={styles.body}
      padding-top={{ base: "20px", lgp: "80px", md: "83px" }}
      padding-bottom={{ base: "40px", lgp: "10px", md: "10px" }}
    >
      {file && (
        <Box className="clientDocCenter">
          <Document
            loading={
              <>
                <Box className="pdfloadingText" mt="100px">
                  {t("label.pdfLoading")}
                </Box>
              </>
            }
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocLoadError}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={""}
              />
            ))}
          </Document>
        </Box>
      )}

      {fileError && (
        <Box className="clientDocCenterError"> {t("label.pdfNotLoading")}</Box>
      )}
    </div>
  )
}
