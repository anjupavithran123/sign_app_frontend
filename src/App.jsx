import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";
import PdfPreview from "./Pages/PdfPreview";
import Upload from "./Pages/Upload";
import Home from "./Pages/Home";
import PdfViewerPage from "./Pages/PdfViewerPage";
import MainLayout from "./Components/Mainlayout";
import PublicSign from "./Pages/PublicSign";

import "./pdfWorker";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ PUBLIC SIGN ROUTE (NO PROTECTION) */}
          <Route path="/public-sign/:token" element={<PublicSign />} />

          {/* PROTECTED ROUTES */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/preview/:id" element={<PdfPreview />} />
            <Route path="/sign/:id" element={<PdfViewerPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

