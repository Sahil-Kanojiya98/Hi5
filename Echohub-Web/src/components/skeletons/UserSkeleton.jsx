const UserSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-black rounded-md animate-pulse">
      <div className="flex items-center gap-3">
        <div className="avatar w-10 h-10 rounded-full bg-gray-600"></div>
        <div>
          <p className="h-4 bg-gray-600 rounded w-32 mb-1"></p>
          <p className="h-3 bg-gray-600 rounded w-20"></p>
        </div>
      </div>
      <div className="px-4 py-2 text-sm bg-gray-600 rounded-full w-32"></div>
    </div>
  );
};

export default UserSkeleton;