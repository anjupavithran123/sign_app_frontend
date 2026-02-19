import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b bg-white">
      {/* Left */}
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        eSign
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Upload Button */}
        <button
          onClick={() => navigate("/upload")}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded
                     hover:bg-indigo-700 text-sm"
        >
          Upload PDF
        </button>

        {/* User email */}
        <span className="text-sm text-gray-600">
          {user?.email}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
