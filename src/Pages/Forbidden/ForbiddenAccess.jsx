import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const ForbiddenAccess = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <FaLock className="text-red-500 text-6xl" />
        </div>
        <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
        <p className="text-lg mb-6">
          You don’t have permission to access this page. Please contact the administrator if you think this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-black font-semibold px-6 py-2 rounded-xl transition-all duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenAccess;
