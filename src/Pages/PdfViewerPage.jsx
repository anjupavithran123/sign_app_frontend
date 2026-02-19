import React, { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { Download, Save ,CloudUpload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { toPng } from "html-to-image";
import { FiCopy, FiCheck } from "react-icons/fi";


import { getPreviewUrl } from "../api/documents";
import { saveElements, getSignaturesByFile ,uploadSignedPDF} from "../api/signature";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewerPage() {
  const { dragItem, setDragItem, user } = useOutletContext();
  const { id } = useParams();
  const [selectedId, setSelectedId] = useState(null);

  const [url, setUrl] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Store refs for each element for html-to-image
  const elementRefs = useRef({});

  // Load PDF + saved elements
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const fileUrl = await getPreviewUrl(id);
        setUrl(fileUrl);

        const { data } = await getSignaturesByFile(id);
        if (data) {
          setElements(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [id]);

  // Drop new element
  const handleDrop = React.useCallback((e) => {
    e.preventDefault();
    if (!dragItem) return;
  
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    // 🔥 If stamp and value is File → convert to base64
    if (dragItem.type === "stamp" && dragItem.file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        const newEl = {
          id: Date.now(),
          x,
          y,
          width: 150,
          height: 50,
          type: "stamp",
          value: reader.result, // ✅ BASE64 stored
        };
  
        setElements((prev) => [...prev, newEl]);
      };
  
      reader.readAsDataURL(dragItem.file);
    } else {
      const newEl = {
        id: Date.now(),
        x,
        y,
        width: 150,
        height: 50,
        ...dragItem,
      };
  
      setElements((prev) => [...prev, newEl]);
    }
  
    setDragItem(null);
  }, [dragItem, setDragItem]);
  
  
//upload
const handleUpload = async () => {
  try {
    const { data } = await uploadSignedPDF(id);

    console.log("Response:", data);
    setSignedUrl(data.url);

    alert("✅ Signed PDF uploaded successfully!");

  } catch (err) {
    console.error(err);
    alert("❌ Upload failed");
  }
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(signedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed", err);
  }
};

  // Save elements
  const handleSave = async () => {
    setLoading(true);
    try {
      await saveElements({
        fileId: id,
        signerId: user?.id,
        elements,
      });
      alert("Document saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving.");
    }
    setLoading(false);
  };

  // Download PDF
  const handleDownload = async () => {
    if (!url) return;
  
    try {
      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );
  
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];
      const { width: pdfWidth, height: pdfHeight } = page.getSize();
  
      const displayedWidth = 800;
      const scale = pdfWidth / displayedWidth;
  
      for (const el of elements) {
        const x = el.x * scale;
        const y = pdfHeight - el.y * scale - el.height * scale;
  
        // ✅ SIGNATURE / INITIALS
        if (el.type === "signature" || el.type === "initials") {
          const elNode = elementRefs.current[el.id];
          if (!elNode) continue;
  
          const dataUrl = await toPng(elNode);
          const img = await pdfDoc.embedPng(dataUrl);
  
          page.drawImage(img, {
            x,
            y,
            width: el.width * scale,
            height: el.height * scale,
          });
        }
  
        // ✅ STAMP (AUTO DETECT PNG/JPEG)
        if (el.type === "stamp" && el.value) {
          let image;
  
          // If blob URL → convert to base64 first
          let dataUrl = el.value;
          if (el.value.startsWith("blob:")) {
            const response = await fetch(el.value);
            const blob = await response.blob();
  
            dataUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          }
  
          // Detect image type
          if (dataUrl.startsWith("data:image/png")) {
            image = await pdfDoc.embedPng(dataUrl);
          } else if (dataUrl.startsWith("data:image/jpeg")) {
            image = await pdfDoc.embedJpg(dataUrl);
          } else {
            console.error("Unsupported image format:", dataUrl.substring(0, 30));
            continue;
          }
  
          page.drawImage(image, {
            x,
            y,
            width: el.width * scale,
            height: el.height * scale,
          });
        }
  
        // ✅ DATE
        if (el.type === "date") {
          const text = new Date().toLocaleDateString();
          page.drawText(text, {
            x,
            y,
            size: 14 * scale,
          });
        }
      }
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "signed-document.pdf";
      a.click();
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  
  if (!url) return <p>Loading...</p>;

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-gray-100">

      {/* Top Action Bar */}
      <div className="w-[800px] flex justify-between mb-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save"}
        </button>
        <button
    onClick={handleUpload}
    className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
  >
    <CloudUpload size={18} />

  </button>
  {signedUrl && (
  <button
    onClick={handleCopy}
    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
  >
    {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
  </button>
)}

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <Download size={18} />
          
        </button>
      </div>

      {/* PDF Container */}
      <div
        className="relative bg-white shadow-lg"
        style={{ width: 800 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Document file={url}>
          <Page pageNumber={1} width={800} />
        </Document>

        {/* Render Elements */}
        {elements.map((el, index) => (
        <Rnd
        key={el.id}
        onMouseDown={() => setSelectedId(el.id)}
        size={{
          width: el.width ?? 150,
          height: el.height ?? 50,
        }}
        position={{
          x: el.x ?? 0,
          y: el.y ?? 0,
        }}
        bounds="parent"
        enableResizing={selectedId === el.id}   // ✅ only resize when selected
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
        <div
          ref={(ref) => (elementRefs.current[el.id] = ref)}
          className={`w-full h-full flex items-center justify-center cursor-move
            ${selectedId === el.id ? "border-2 border-blue-500" : ""}`}
        >
          {/* Signature */}
          {el.type === "signature" && (
            <div
              className={el.font}
              style={{
                color: el.color,
                fontSize: el.height * 0.6,
                lineHeight: 1,
              }}
            >
              {el.value}
            </div>
          )}
      
          {/* Printed Name */}
          {el.type === "name" && (
            <div
              style={{
                color: "#000",
                fontSize: el.height * 0.5,
                fontWeight: 500,
              }}
            >
              {el.value}
            </div>
          )}
      
          {/* Initials */}
          {el.type === "initials" && (
            <div
              className={el.font}
              style={{
                color: el.color,
                fontSize: el.height * 0.7,
              }}
            >
              {el.value}
            </div>
          )}
      
          {/* Stamp */}
          {el.type === "stamp" && el.value && (
            <img
              src={el.value}
              alt="Stamp"
              className="w-full h-full object-contain pointer-events-none"
            />
          )}
      
          {/* Date */}
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
  );
}
