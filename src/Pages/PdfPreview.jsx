import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { getPreviewUrl } from "../api/documents";

pdfjs.GlobalWorkerOptions.workerSrc = 
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer() {
  const { id } = useParams();   // get doc ID from URL
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadPdf = async () => {
      try {
        const fileUrl = await getPreviewUrl(id);  // get PDF file URL
        setUrl(fileUrl);
      } catch (err) {
        console.error("Failed to load PDF", err);
      }
    };

    loadPdf();
  }, [id]);

  if (!url) return <p className="text-center mt-10">Loading PDF…</p>;

  return (
    <div className="flex justify-center p-4">
      <Document file={url}>
        <Page pageNumber={1} width={800} />
      </Document>
    </div>
  );
}
