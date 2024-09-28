import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axiosInstance from "../utils/axiosConfig";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        username: authUser.username || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put("/user", formData);
      const { id, username, fullname, profilePictureUrl } = response.data;
      dispatch(updateUser({ id, username, fullname, profilePictureUrl }));
      setIsModelOpen(false);
    } catch (err) {
      setError(err.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => setIsModelOpen(true)}
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal" open={isModelOpen}>
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md resize-none"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-full btn-sm text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            className="outline-none"
            onClick={() => setIsModelOpen(false)}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
};

EditProfileModal.propTypes = {
  authUser: PropTypes.shape({
    fullName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    bio: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default EditProfileModal;
