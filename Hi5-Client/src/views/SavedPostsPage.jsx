const SavedPostsPage=() => {

  return (
    <div className="flex-[4_4_0] border-gray-700 mr-auto border-r min-h-[calc(100vh+1px)]">
      <div className="top-0 z-10 sticky border-gray-700 bg-black mb-3 px-6 p-3 border-b">
        <div className="flex justify-between items-center w-full">
          <p className="font-semibold text-white text-xl">Saved Posts</p>
        </div>
      </div>
      {/* <Posts feedType="saved"/> */}
    </div>
  );
}

export default SavedPostsPage;
