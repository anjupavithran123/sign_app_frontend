import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getMyDocuments, deleteDocument } from "../api/documents";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getMyDocuments()
      .then((data) => {
        console.log("DOCUMENTS:", data);
        setDocs(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;
  
    try {
      await deleteDocument(id);
  
      // Remove from UI
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
  
    } catch (error) {
      console.error(error);
      alert("Failed to delete document");
    }
  };
  // 🔎 Filter documents
  const filteredDocs =
  statusFilter === "all"
    ? docs
    : docs.filter(
        (doc) =>
          doc.signatures?.[0]?.status === statusFilter
      );


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex justify-center overflow-auto bg-gray-100">
      <div className="w-full max-w-6xl p-4 sm:p-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            📂 My Documents
          </h1>

          <button
            onClick={() => navigate("/upload")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Upload PDF
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["all", "pending", "signed", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">No documents found</p>
            <p className="text-sm">
              {docs.length === 0
                ? "Upload a PDF to get started"
                : "No documents match this status"}
            </p>
          </div>
        )}

        {/* Documents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Title + Status */}
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800 truncate">
                    {doc.original_name}
                  </p>

                  {/* <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${
                        doc.status === "signed"
                          ? "bg-green-100 text-green-700"
                          : doc.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {doc.status?.toUpperCase() || "PENDING"}
                  </span> */}
                </div>

                <p className="text-xs text-gray-500">
                  Uploaded on{" "}
                  {new Date(doc.created_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/preview/${doc.id}`)}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Preview
                </button>
                <button
  onClick={() => handleDelete(doc.id)}
  className="text-red-600 hover:text-red-800 transition"
  title="Delete"
>
  <Trash2 size={18} />
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
