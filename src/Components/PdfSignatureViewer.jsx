import { Document, Page } from "react-pdf";
import { useEffect, useState } from "react";
import {
  createSignature,
  getSignaturesByFile,
  signDocument
} from "../api/signature";

export default function PdfSignatureViewer({ fileId, pdfUrl }) {
  const [signatures, setSignatures] = useState([]);
  const [numPages, setNumPages] = useState(null);

  const loadSignatures = async () => {
    const res = await getSignaturesByFile(fileId);
    setSignatures(res.data);
  };

  useEffect(() => {
    loadSignatures();
  }, [fileId]);

  // Click to place signature
  const handlePdfClick = async (e, pageNumber) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    await createSignature({
      fileId,
      x,
      y,
      page: pageNumber
    });

    loadSignatures();
  };

  const handleSign = async (id) => {
    await signDocument(id);
    loadSignatures();
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={index}
              className="relative mb-4"
              onClick={(e) => handlePdfClick(e, index + 1)}
            >
              <Page pageNumber={index + 1} />

              {/* Signature placeholders */}
              {signatures
                .filter(sig => sig.page === index + 1)
                .map(sig => (
                  <div
                    key={sig.id}
                    className={`absolute px-2 py-1 text-xs cursor-pointer
                      ${
                        sig.status === "signed"
                          ? "bg-green-100 border-green-500"
                          : "bg-yellow-100 border-dashed border-red-500"
                      }
                      border rounded`}
                    style={{
                      left: sig.x,
                      top: sig.y,
                      width: 140,
                      height: 40
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (sig.status === "pending") handleSign(sig.id);
                    }}
                  >
                    {sig.status === "signed"
                      ? "✔ Signed"
                      : "Click to Sign"}
                  </div>
                ))}
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
