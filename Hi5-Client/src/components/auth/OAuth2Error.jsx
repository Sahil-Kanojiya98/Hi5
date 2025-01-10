import { useNavigate } from "react-router-dom";

const OAuth2Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg max-w-lg text-center">
        <p className="mb-4 font-bold text-2xl text-gray-800 dark:text-gray-100">
          Authentication Error
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          An error occurred during the OAuth2 authentication process. Please try
          again or contact support.
        </p>
        <div className="mt-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 dark:bg-blue-500 px-4 py-2 rounded text-white"
          >
            Retry Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuth2Error;
