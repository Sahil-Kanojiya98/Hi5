import PropTypes from "prop-types";
import { useState } from "react";
import ViewStorysModal from "./ViewStorysModal";

const Story = ({ newStoryUser }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleStoryClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="flex flex-col items-center text-center cursor-pointer"
        onClick={handleStoryClick}
      >
        <div className="border-2 border-blue-500 rounded-full w-16 h-16 overflow-hidden">
          <img
            src={newStoryUser.profilePictureUrl}
            alt={`${newStoryUser.fullname}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mt-2 w-20 text-gray-700 text-sm truncate">
          {newStoryUser.fullname}
        </p>
      </div>
      {isModalOpen && (
        <ViewStorysModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          newStoryUser={newStoryUser}
        />
      )}
    </>
  );
};

Story.propTypes = {
  newStoryUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    totalStorys: PropTypes.number.isRequired,
    totalSeenStorys: PropTypes.number.isRequired,
  }).isRequired,
};

export default Story;
