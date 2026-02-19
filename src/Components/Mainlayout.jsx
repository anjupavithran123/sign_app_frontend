import { useState } from "react";
import TopBar from "../Components/TopBar";
import PdfSidebar from "../Components/PdfSidebar";
import SignaturePanel from "../Components/SignaturePanel";
import { Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ ADD THIS

export default function MainLayout() {
  const { id } = useParams();
  const fileId = id || null;

  const { user } = useAuth(); // ✅ ADD THIS

  const [dragItem, setDragItem] = useState(null);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 bg-white border-r overflow-y-auto">
          <PdfSidebar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ dragItem, setDragItem, user }} />
        </div>

        <div className="w-80 bg-white border-l overflow-y-auto">
          <SignaturePanel
            fileId={fileId}
            setDragItem={setDragItem}
          />
        </div>
      </div>
    </div>
  );
}
