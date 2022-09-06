import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack"
const [state, setState] = useState()

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PdfViewer = ({ url }: { url?: string }) => (
  <Document file={url}>
    <Page pageNumber={1} scale={0.45} />
  </Document>
)

export default PdfViewer
