
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <p className="mb-6 text-gray-500">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
