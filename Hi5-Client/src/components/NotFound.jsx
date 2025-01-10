import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-lg w-full max-w-lg text-center">
        <p className="mb-4 font-bold text-5xl text-gray-800 dark:text-gray-100">
          404 Not Found
        </p>
        <p className="mb-6 text-gray-600 text-lg dark:text-gray-300">
          Oops! The page you&#39;re looking for doesn&#39;t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 dark:bg-blue-500 px-6 py-3 rounded-lg font-semibold text-white focus:outline-none"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
