import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import SignaturePanel from "../Components/SignaturePanel";
import api from "../api/axios";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PublicSignPage() {
  const { token } = useParams();
  const [showRejectCard, setShowRejectCard] = useState(false);
const [rejectReason, setRejectReason] = useState("");

  const [signatureData, setSignatureData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [elements, setElements] = useState([]);
  const [dragItem, setDragItem] = useState(null);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState(null);
  const elementRefs = useRef({});

  // Fetch signature info
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const res = await api.get(`/api/signatures/public/${token}`);
        const signature = res.data.signature;

        if (!signature) throw new Error("Invalid response");

        setSignatureData(signature);

        const url =
          signature.documents?.signed_url ||
          signature.documents?.file_url ||
          null;

        setPdfUrl(url);
        setElements(signature.elements || []);
        setSigned(signature.status === "signed");
      } catch (err) {
        console.error(err);
        setError("Invalid or expired link ❌");
      }
    };

    fetchSignature();
  }, [token]);
  const handleDownload = () => {
    if (!pdfUrl) return;
  
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "signed-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Drop handler (supports stamp base64)
  const handleDrop = (e) => {
    e.preventDefault();
    if (!dragItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // STAMP (convert file to base64)
    if (dragItem.type === "stamp" && dragItem.file) {
      const reader = new FileReader();

      reader.onload = () => {
        setElements((prev) => [
          ...prev,
          {
            id: Date.now(),
            x,
            y,
            width: 150,
            height: 50,
            type: "stamp",
            value: reader.result,
          },
        ]);
      };

      reader.readAsDataURL(dragItem.file);
    } else {
      setElements((prev) => [
        ...prev,
        {
          id: Date.now(),
          x,
          y,
          width: 150,
          height: 50,
          ...dragItem,
        },
      ]);
    }

    setDragItem(null);
  };

  // SIGN
  const handleSign = async () => {
    try {
      await api.patch(
        `/api/signatures/public/${signatureData.token.trim()}/status`,
        { action: "sign", elements }
      );

      setSigned(true);
      alert("Document signed ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to sign ❌");
    }
  };

  // REJECT
  const handleReject = async (reason) => {
    try {
      await api.patch(
        `/api/signatures/public/${signatureData.token.trim()}/status`,
        { action: "reject", reason }
      );

      setSigned(true);
      alert("Document rejected ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to reject ❌");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!pdfUrl) return <p>Loading...</p>;

  return (
   
<div className="flex h-screen bg-gray-100 overflow-hidden">

    
          {/* PDF Viewer */}
          <div className="flex-1 flex justify-center overflow-y-auto p-6">
  <div
    className="relative bg-white shadow-lg"
    style={{ width: 800 }}
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleDrop}
  >

        <Document file={pdfUrl}>
          <Page pageNumber={1} width={800} />
        </Document>

        {/* Render Elements */}
        {elements.map((el) => (
          <Rnd
            key={el.id}
            size={{
              width: el.width ?? 150,
              height: el.height ?? 50,
            }}
            position={{
              x: el.x ?? 0,
              y: el.y ?? 0,
            }}
            bounds="parent"
            onDragStop={(e, d) => {
              setElements((prev) =>
                prev.map((item) =>
                  item.id === el.id
                    ? { ...item, x: d.x, y: d.y }
                    : item
                )
              );
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setElements((prev) =>
                prev.map((item) =>
                  item.id === el.id
                    ? {
                        ...item,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        x: position.x,
                        y: position.y,
                      }
                    : item
                )
              );
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              
              {/* SIGNATURE */}
              {el.type === "signature" && (
                <div
                  className={el.font}
                  style={{
                    color: el.color || "#000",
                    fontSize: el.height * 0.6,
                    lineHeight: 1,
                  }}
                >
                  {el.value}
                </div>
              )}

              {/* STAMP */}
              {el.type === "stamp" && el.value && (
                <img
                  src={el.value}
                  alt="Stamp"
                  className="w-full h-full object-contain pointer-events-none"
                />
              )}

              {/* DATE */}
              {el.type === "date" && (
                <div
                  style={{
                    fontSize: el.height * 0.4,
                    color: "#6b21a8",
                  }}
                >
                  {new Date().toLocaleDateString()}
                </div>
              )}
            </div>
          </Rnd>
        ))}
      </div>
</div>
      {/* Sidebar */}
      <SignaturePanel
  fileId={signatureData?.file_id}
  setDragItem={setDragItem}
  hideSignButton={true}
/>

 {/* Action Buttons */}
{!signed && !showRejectCard && (
  <div className="fixed bottom-10 right-10 flex gap-4">

    {/* Sign Button */}
    <button
      onClick={handleSign}
      className="bg-orange-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:brightness-110 transition"
    >
      Sign Document ➔
    </button>

    {/* Reject Button */}
    <button
      onClick={() => setShowRejectCard(true)}
      className="bg-red-600 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:brightness-110 transition"
    >
      Reject ❌
    </button>

  </div>
)}
{/* Reject Card */}
{!signed && showRejectCard && (
  <div className="fixed bottom-10 right-10 w-80 bg-white rounded-xl shadow-2xl p-5 border border-gray-200">

    <h3 className="text-sm font-semibold mb-3 text-gray-700">
      Reason for Rejection
    </h3>

    <textarea
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      placeholder="Enter rejection reason..."
      className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
      rows={3}
    />

    <div className="flex justify-end gap-3 mt-4">
      <button
        onClick={() => {
          setShowRejectCard(false);
          setRejectReason("");
        }}
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        onClick={() => {
          if (!rejectReason.trim()) return alert("Please enter a reason");
          handleReject(rejectReason);
        }}
        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Confirm Reject
      </button>
    </div>

  </div>
)}
      {signed && (
        <div className="fixed bottom-10 right-10 text-green-600 font-bold text-xl">
          Document processed ✅
        </div>
      )}
    </div>
  );
}
