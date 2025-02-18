const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-black shadow-md mx-auto mb-6 p-4 rounded-md w-full max-w-xl animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-10 h-10"></div>
          <div>
            <div className="bg-gray-300 dark:bg-gray-700 mb-1 rounded-md w-24 h-4"></div>
            <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-16 h-3"></div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-5 h-5"></div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-5 h-5"></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-300 dark:bg-gray-700 mb-2 rounded-md w-full h-4"></div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 h-4"></div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-full h-48"></div>
      </div>

      <div className="flex justify-between items-center text-gray-300 dark:text-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-5 h-5"></div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-5 h-5"></div>
          <div className="bg-gray-300 dark:bg-gray-700 rounded-md w-5 h-5"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
