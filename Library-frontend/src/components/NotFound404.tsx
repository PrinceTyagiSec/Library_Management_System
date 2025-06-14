import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound404;
