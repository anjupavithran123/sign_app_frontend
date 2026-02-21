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
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        
        {/* Left */}
        <div
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-extrabold tracking-tight text-indigo-600 cursor-pointer hover:opacity-80 transition"
        >
          eSignPro
        </div>
  
        {/* Right */}
        <div className="flex items-center gap-6">
          
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full shadow-sm">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {user?.email}
            </span>
          </div>
  
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
  
        </div>
      </div>
    </header>
  );
  
}
