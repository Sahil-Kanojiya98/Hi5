import { useEffect, useState } from "react";
import {
  CameraAlt,
} from "@mui/icons-material";
import CreateStoryModal from "./CreateStoryModal.jsx";
import { getNewStoryUsers } from "../../../services/api.js";
import Story from "./Story.jsx";
import StorySkeleton from "../../skeletons/StorySkeleton.jsx";

const Stories = () => {

  const [newStoryUsers, setNewStoryUsers] = useState([]);
  const [isUsersStorysLoading, setIsUsersStorysUsersLoading] = useState(true);
  const fetchFolloingsUsersStories = async () => {
    try {
      setIsUsersStorysUsersLoading(true);
      const response = await getNewStoryUsers();
      setNewStoryUsers(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsUsersStorysUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchFolloingsUsersStories();
  }, []);

  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const handleCreateStoryModelOpen = () => {
    setIsCreateStoryModalOpen(true);
  };
  const handleCreateStoryModelClose = () => {
    setIsCreateStoryModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-4 bg-white shadow-md p-4 rounded-md w-full max-w-xl overflow-x-auto hide-scrollbar">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex justify-center items-center border-2 border-blue-500 rounded-full w-16 h-16 overflow-hidden"
            onClick={handleCreateStoryModelOpen}
          >
            <CameraAlt className="text-blue-500 text-2xl" />
          </div>
          <p className="mt-2 w-20 text-gray-700 text-sm truncate">My Story</p>
        </div>
        {
          isUsersStorysLoading && <StorySkeleton />
        }
        {!isUsersStorysLoading && newStoryUsers.map(
          (newStoryUser) => <Story key={newStoryUser.id} newStoryUser={newStoryUser} />
        )}
      </div>

      {isCreateStoryModalOpen && (
        <CreateStoryModal isOpen={isCreateStoryModalOpen} closeModal={handleCreateStoryModelClose} />
      )}

    </>
  );
};

export default Stories;
