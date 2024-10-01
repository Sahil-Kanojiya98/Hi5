import Posts from "../components/Posts";
// import axiosInstance from '../utils/axiosConfig';

function SavedPostsPage() {

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-[calc(100vh+1px)] ">
      <div className="sticky top-0 z-10 border-b border-gray-700 p-3 px-6 bg-black mb-3">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-semibold text-white">Saved Posts</p>
        </div>
      </div>
      <Posts feedType="saved"/>
    </div>
  );
}

export default SavedPostsPage;
