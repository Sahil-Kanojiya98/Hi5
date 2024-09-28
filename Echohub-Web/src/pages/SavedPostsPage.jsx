import React from 'react';
import Posts from '../components/Posts';
import axiosInstance from '../utils/axiosConfig';

function SavedPostsPage() {
  const handleRemoveAll = async () => {
    try {
      await axiosInstance.delete('/user/saved-posts');
      alert('All saved posts have been removed.');
    } catch (error) {
      console.error('Error removing saved posts:', error);
      alert('Failed to remove saved posts.');
    }
  };

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen ">
      <div className="sticky top-0 z-10 border-b border-gray-700 p-3 px-6 bg-black">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl font-semibold text-white">Saved Posts</p>
          {/* <button
            onClick={handleRemoveAll}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove All
          </button> */}
        </div>
      </div>
      <Posts feedType="saved" />
    </div>
  );
}

export default SavedPostsPage;
