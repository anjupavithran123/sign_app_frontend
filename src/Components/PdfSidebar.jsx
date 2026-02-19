import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getMyDocuments, getPreviewUrl } from "../api/documents";
import { useNavigate, useParams } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfSidebar() {
  const [docs, setDocs] = useState([]);
  const [urls, setUrls] = useState({});
  const navigate = useNavigate();
  const { id: activeId } = useParams();

  useEffect(() => {
    getMyDocuments().then(async (documents) => {
      setDocs(documents);

      // fetch preview URLs for each doc
      const map = {};
      for (const doc of documents) {
        map[doc.id] = await getPreviewUrl(doc.id);
      }
      setUrls(map);
    });
  }, []);

  return (
    <div className="h-full bg-gray-100 border-r overflow-y-auto p-2 space-y-3">
      {docs.map((doc) => (
        <div
          key={doc.id}
          onClick={() => navigate(`/sign/${doc.id}`)}
          className={`cursor-pointer bg-white border rounded p-2
            hover:border-indigo-500 transition
            ${String(doc.id) === activeId ? "ring-2 ring-indigo-500" : ""}`}
        >
          {/* REAL PDF THUMBNAIL */}
          <div className="flex justify-center bg-gray-50">
            {urls[doc.id] ? (
              <Document file={urls[doc.id]}>
                <Page
                  pageNumber={1}
                  width={160}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            ) : (
              <div className="h-40 flex items-center justify-center text-xs text-gray-400">
                Loading…
              </div>
            )}
          </div>

          {/* Filename */}
          <p className="text-xs mt-2 truncate text-gray-700">
            {doc.original_name}
          </p>
        </div>
      ))}
    </div>
  );
}
