import { Person } from "@mui/icons-material";

const StorySkeleton = () => {
  return (
    <div className="flex flex-col items-center text-center animate-pulse">
      <div className="flex justify-center items-center bg-gray-300 rounded-full w-16 h-16">
        <Person className="text-gray-500 text-2xl" />
      </div>
      <p className="bg-gray-300 mt-2 rounded w-20 h-4"></p>
    </div>
  );
};

export default StorySkeleton;
