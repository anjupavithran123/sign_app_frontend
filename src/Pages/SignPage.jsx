import React, { useState } from "react";
import SignaturePanel from "../Components/SignaturePanel";
import PdfViewerPage from "./PdfViewerPage";

export default function SignPage() {
  const [dragItem, setDragItem] = useState(null);

  return (
    <div className="flex h-screen">
      <SignaturePanel setDragItem={setDragItem} />
      <PdfViewerPage dragItem={dragItem} setDragItem={setDragItem} />
    </div>
  );
}
