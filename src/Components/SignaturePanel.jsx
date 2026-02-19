import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // get logged-in user
import { createSignature } from "../api/signature";
import InviteSignersModal from "./InviteSignersModal";

// Signature font options
const SIGNATURE_FONTS = [
  { id: 1, class: "font-dancing" }, { id: 2, class: "font-vibes" }, { id: 3, class: "font-pacifico" },
  { id: 4, class: "font-yellowtail" }, { id: 5, class: "font-satisfy" }, { id: 6, class: "font-alex" },
  { id: 7, class: "font-cookie" }, { id: 8, class: "font-parisienne" }, { id: 9, class: "font-allura" },
  { id: 10, class: "font-pinyon" }, { id: 11, class: "font-marck" }, { id: 12, class: "font-apple" },
  { id: 13, class: "font-arizonia" }, { id: 14, class: "font-caveat" }, { id: 15, class: "font-badscript" },
  { id: 16, class: "font-reenie" },
];

// Ink colors
const COLORS = ["#000000", "#ef4444", "#3b82f6", "#22c55e"];

export default function SignaturePanel({ fileId, setDragItem }) {
  const { user } = useAuth(); // get current logged-in user
  const signerId = user?.id;
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Signature");
  const fileInputRef = useRef(null);

  const [signatureData, setSignatureData] = useState({
    fullName: user?.fullName || "Anju",
    initials: user?.initials || "M",
    style: "font-dancing",
    color: "#000000",
    companyStamp: null,
    signedAt: null,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = () => {
      setSignatureData({
        ...signatureData,
        companyStamp: reader.result,   // ✅ REAL BASE64
      });
    };
  
    reader.readAsDataURL(file);   // ✅ converts to base64
  };
  
  
  const handleSign = async () => {
    if (!fileId) return alert("File ID is missing ❌");
    if (!signerId) return alert("User not logged in ❌");

    const signedAt = new Date().toISOString();

    const payload = {
      fileId,
      signerId,
      x: 400,
      y: 600,
      page: 1,
      fullName: signatureData.fullName,
      initials: signatureData.initials,
      style: signatureData.style,
      color: signatureData.color,
      companyStamp: signatureData.companyStamp,
      signedAt,
    };

    try {
      const response = await createSignature(payload);
      console.log("Signature created:", response.data);
      setSignatureData({ ...signatureData, signedAt });
      alert("Document signed successfully ✅");
    } catch (error) {
      console.error("Error signing document:", error);
      alert("Failed to sign document ❌");
    }
  };
  const handleDragStart = (item) => {
    setDragItem(item);
  };
  

  return (
    <div className="h-screen flex bg-[#f3f3f3] font-sans">
      {/* DOCUMENT PREVIEW */}
      {/* <div className="flex-1 flex justify-center p-8 overflow-auto border-r border-gray-200">
        <div className="bg-white shadow-lg w-[550px] h-[750px] relative p-12">
          <div
            className={`absolute bottom-32 right-16 text-5xl ${signatureData.style}`}
            style={{ color: signatureData.color }}
          >
            {signatureData.fullName}
          </div>
        </div>
      </div> */}

      {/* SIDEBAR */}
      <div className="w-80 bg-white flex flex-col p-4 shadow-xl">
      <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Invite Signers
        </button>

        {showInviteModal && (
          <InviteSignersModal
            fileId={fileId}
            onClose={() => setShowInviteModal(false)}
          />
        )}





        <h3 className="text-[11px] font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Required fields
        </h3>

        <div
          className="border-2 border-blue-100 rounded-lg p-3 bg-blue-50/30 flex items-center gap-3 mb-6 cursor-pointer hover:border-blue-300 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <div className="bg-blue-600 p-2 rounded text-white text-xs">🖋</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[9px] text-blue-500 font-bold uppercase">Signature</p>
            <p className={`text-2xl truncate ${signatureData.style}`} style={{ color: signatureData.color }}>
              {signatureData.fullName}
            </p>
          </div>
          <span className="text-blue-400 text-lg">✎</span>
        </div>

        <h3 className="text-[11px] font-bold text-gray-400 uppercase mb-3 tracking-wider">
          Optional fields
        </h3>
        <div className="space-y-2 flex-1">
        <SidebarField
  icon="👤"
  label="Name"
  value={signatureData.fullName}
  font="font-sans"   // normal font
  color="#000000"    // normal black
  type="name"        // new type
  setDragItem={setDragItem}
/>

        <SidebarField
  icon="AC"
  label="Initials"
  value={signatureData.initials}
  font={signatureData.style}
  color={signatureData.color}
  type="initials"
  setDragItem={setDragItem}
/>
<SidebarField
  icon="👤✎"
  label="Sign"
  value={signatureData.fullName}
  font={signatureData.style}
  color={signatureData.color}
  type="signature"
  setDragItem={setDragItem}
/>
<SidebarField
  icon="🏢"
  label="Company Stamp"
  value={signatureData.companyStamp}
  type="stamp"
  setDragItem={setDragItem}
/>


<SidebarField
  icon="⏱"
  label="Signed At"
  value={
    signatureData.signedAt
      ? new Date(signatureData.signedAt).toLocaleString()
      : new Date().toLocaleDateString()
  }
  type="date"
  setDragItem={setDragItem}
/>
        </div>

        <button
          onClick={handleSign}
          className="w-full bg-[#ff5a1f] text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4"
        >
          Sign ➔
        </button>
      </div>

      {showModal && (
        <SignatureModal
          signatureData={signatureData}
          setSignatureData={setSignatureData}
          setShowModal={setShowModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fileInputRef={fileInputRef}
        />
      )}
    </div>
  );
}

function SidebarField({ icon, label, value, font, color, type, setDragItem }) {
  return (
    <div
      draggable
      onDragStart={() =>
        setDragItem({
          type,
          value,
          font,
          color,
        })
      }
      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 cursor-move shadow-sm transition-colors"
    >
      <div className="text-gray-400 font-bold text-[10px] w-6 flex justify-center bg-gray-50 rounded py-1">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[9px] text-gray-400 font-bold uppercase">
          {label}
        </p>
        {type === "stamp" && value ? (
  <img src={value} alt="Stamp" className="h-8 object-contain" />
) : (
  <p className={`text-sm font-medium truncate ${font}`} style={{ color }}>
    {value || `Add ${label}`}
  </p>
)}

      </div>
    </div>
  );
}

function SignatureModal({ signatureData, setSignatureData, setShowModal, activeTab, setActiveTab, fileInputRef }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = () => {
      setSignatureData({
        ...signatureData,
        companyStamp: reader.result,   // ✅ REAL BASE64
      });
    };
  
    reader.readAsDataURL(file);   // ✅ converts to base64
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold text-gray-700">Set your signature details</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-400 text-3xl hover:text-black">&times;</button>
        </div>

        <div className="p-6">
          {/* Name & Initials */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Full name:</label>
              <input
                className="w-full bg-[#f4f7fa] border border-gray-200 p-3 rounded-lg mt-1 outline-none focus:border-blue-400"
                value={signatureData.fullName}
                onChange={(e) => setSignatureData({ ...signatureData, fullName: e.target.value })}
              />
            </div>
            <div className="w-1/4">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Initials:</label>
              <input
                className="w-full bg-[#f4f7fa] border border-gray-200 p-3 rounded-lg mt-1 outline-none text-center font-bold"
                value={signatureData.initials}
                onChange={(e) => setSignatureData({ ...signatureData, initials: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b text-sm font-bold text-gray-400 mb-0">
            {["Signature", "Initials", "Company Stamp"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 cursor-pointer transition-all ${activeTab === tab ? 'border-b-2 border-orange-500 text-orange-600' : 'hover:text-gray-600'}`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="border border-gray-200 rounded-lg h-64 overflow-y-auto bg-white my-4 shadow-inner">
            {activeTab === "Signature" && SIGNATURE_FONTS.map((f) => (
              <div
                key={f.id}
                onClick={() => setSignatureData({ ...signatureData, style: f.class })}
                className={`flex items-center p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${signatureData.style === f.class ? 'bg-blue-50/40' : ''}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-6 ${signatureData.style === f.class ? 'border-green-500' : 'border-gray-300'}`}>
                  {signatureData.style === f.class && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                </div>
                <span className={`text-4xl leading-tight ${f.class}`} style={{ color: signatureData.color }}>
                  {signatureData.fullName || "Signature"}
                </span>
              </div>
            ))}

            {activeTab === "Initials" && (
              <div className="flex items-center justify-center h-full">
                <span className={`text-9xl ${signatureData.style}`} style={{ color: signatureData.color }}>
                  {signatureData.initials || "V"}
                </span>
              </div>
            )}

            {activeTab === "Company Stamp" && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                {signatureData.companyStamp ? (
                  <div className="relative group">
                    <img src={signatureData.companyStamp} className="h-32 object-contain" alt="Stamp" />
                    <button onClick={() => setSignatureData({ ...signatureData, companyStamp: null })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No stamp uploaded</p>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-bold"
                >
                  Upload Stamp
                </button>
              </div>
            )}
          </div>

          {/* Ink Colors */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ink:</span>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSignatureData({ ...signatureData, color: c })}
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform ${signatureData.color === c ? 'ring-2 ring-gray-400 scale-125' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#ff5a1f] text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
