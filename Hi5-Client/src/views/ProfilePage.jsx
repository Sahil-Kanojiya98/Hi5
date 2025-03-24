import MainLayout from "../components/layout/MainLayout";
import {
  ArrowBackSharp,
  Link as LinkIcon,
  CalendarToday,
  Edit,
  Settings,
  Male,
  Female,
  Transgender,
  CheckCircle,
  PersonAdd,
  HourglassEmpty,
  Email,
  Lock,
  Send,
} from "@mui/icons-material";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  follow,
  getUserProfile,
  unfollow,
  updateProfileAndCoverImage,
  updateProfileInfo,
} from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/userSlice";
import RequestsModel from "../components/temp/RequestsModel";
import ConnectionsModel from "../components/temp/ConnectionsModel";
import ProfileTabs from "../components/profile/ProfileTabs";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState("");
  const [profileType, setProfileType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverImage, setCoverImage] = useState();
  const [profileImage, setProfileImage] = useState();
  const [coverImageFile, setCoverImageFile] = useState();
  const [profileImageFile, setProfileImageFile] = useState();

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (coverImage) {
      URL.revokeObjectURL(coverImage);
    }
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
    setCoverImageFile(file);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
    setProfileImageFile(file);
  };

  const dispatch = useDispatch();
  const userProfileData = useSelector((state) => state?.user?.profile);

  const [isEditable, setIsEditable] = useState(false);
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const toogleEditable = () => {
    setFullname(profileData?.fullname);
    setBio(profileData?.bio);
    setLink(profileData?.link);
    setDateOfBirth(
      new Date(profileData?.dateOfBirth).toISOString().split("T")[0]
    );
    setGender(profileData?.gender);
    setIsEditable((prev) => !prev);
  };

  const profileSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, "Fullname must be at least 3 characters")
      .max(50, "Fullname must not exceed 50 characters") // Corrected limit
      .matches(/^[A-Za-z ]+$/, "Full name can only contain letters and spaces")
      .required("Full name is required"),
    dob: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .required("Date of birth is required"),
    gender: Yup.string()
      .oneOf(
        ["male", "female", "other", "prefer_not_to_say"],
        "Please select a valid gender"
      )
      .required("Gender is required"),
  });

  const updateHandler = async () => {
    if (isEditable) {
      try {
        const formData = {
          fullname,
          dob: dateOfBirth,
          gender: gender.toLowerCase(),
        };

        await profileSchema.validate(formData, { abortEarly: false });

        await updateProfileInfo({
          fullname,
          link,
          bio,
          dateOfBirth,
          gender,
        });
        setProfileData((prev) => {
          return {
            ...prev,
            fullname,
            bio,
            link,
            dateOfBirth,
            gender,
          };
        });
        dispatch(
          setUser({
            ...userProfileData,
            fullname,
          })
        );
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Data not updated"
        );
      } finally {
        setIsEditable(false);
      }
    }

    if (!coverImageFile && !profileImageFile) {
      return;
    }
    const formData = new FormData();
    if (coverImageFile) {
      formData.append("coverPicture", coverImageFile);
    }
    if (profileImageFile) {
      formData.append("profilePicture", profileImageFile);
    }
    try {
      const response = await updateProfileAndCoverImage(formData);
      setProfileData((prev) => {
        return {
          ...prev,
          coverPictureUrl: response.data.coverPictureUrl,
          profilePictureUrl: response.data.profilePictureUrl,
        };
      });
      dispatch(
        setUser({
          ...userProfileData,
          profilePictureUrl: response.data.profilePictureUrl,
        })
      );
    } catch (error) {
      console.log(error);
      toast.error("Image Upload Error");
    } finally {
      setCoverImageFile(null);
      setProfileImageFile(null);
    }
  };

  const [followStatus, setFollowStatus] = useState("NOT_FOLLOWED");

  const followStatusClickHandler = async () => {
    console.log(followStatus);
    if (followStatus === "FOLLOWED") {
      try {
        const response = await unfollow(profileData.id);
        if (response.data?.currentStatus === "NOT_FOLLOWED") {
          setProfileData((prev) => {
            return {
              ...prev,
              followersCount: prev?.followersCount - 1,
            };
          });
        }
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "NOT_FOLLOWED") {
      try {
        const response = await follow(profileData.id);
        if (response.data?.currentStatus === "FOLLOWED") {
          setProfileData((prev) => {
            return {
              ...prev,
              followersCount: prev?.followersCount + 1,
            };
          });
        }
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === "REQUEST_SENT") {
      console.log("already request sent");
    } else {
      console.log("Invalid Status");
    }
  };

  const myId = useSelector((state) => state?.user?.profile?.id);
  const { userId } = useParams();

  const isMyProfile = myId === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        const data = response.data;
        setProfileData(data);
        setProfileType(data?.profileType);
        setCoverImage(data?.coverPictureUrl);
        setProfileImage(data?.profilePictureUrl);
        setFollowStatus(data?.followStatus);
      } catch (err) {
        console.log(err);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleCancel = () => {
    setCoverImage(profileData?.coverPictureUrl);
    setProfileImage(profileData?.profilePictureUrl);
    setCoverImageFile(null);
    setProfileImageFile(null);
    setIsEditable(false);
  };

  const [isSentRequestsModelOpen, setIsSentRequestsModelOpen] = useState(false);
  const handleSentRequestsModelOpen = () => {
    setIsSentRequestsModelOpen(true);
  };
  const handleSentRequestsModelClose = () => {
    setIsSentRequestsModelOpen(false);
  };
  const [isReceivedRequestsModelOpen, setIsReceivedRequestsModelOpen] =
    useState(false);
  const handleReceivedRequestsModelOpen = () => {
    setIsReceivedRequestsModelOpen(true);
  };
  const handleReceivedRequestsModelClose = () => {
    setIsReceivedRequestsModelOpen(false);
  };
  const [isFollowersModelOpen, setIsFollowersModelOpen] = useState(false);
  const handleFollowersModelOpen = () => {
    setIsFollowersModelOpen(true);
  };
  const handleFollowersModelClose = () => {
    setIsFollowersModelOpen(false);
  };
  const [isFollowingsModelOpen, setIsFollowingsModelOpen] = useState(false);
  const handleFollowingsModelOpen = () => {
    setIsFollowingsModelOpen(true);
  };
  const handleFollowingsModelClose = () => {
    setIsFollowingsModelOpen(false);
  };

  useEffect(() => {
    handleSentRequestsModelClose();
    handleReceivedRequestsModelClose();
    handleFollowersModelClose();
    handleFollowingsModelClose();
  }, [userId]);

  return (
    <MainLayout>
      <div className="flex justify-center bg-gray-100 dark:bg-gray-900 mx-auto pt-[70px] md:pt-0 md:pl-[70px] lg:pl-[260px] w-full">
        <div className="flex flex-col justify-center w-full max-w-3xl">
          {error && (
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 shadow-lg mt-[15dvh] p-6 rounded-lg w-full min-h-[200px]">
              <h1 className="mb-4 font-bold text-red-600 text-lg">
                Profile Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                An error occurred while loading the profile, or the profile
                doesn&apos;t exist. Please try again later or contact support.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-600 shadow-md mt-4 px-6 py-2 rounded-lg text-white transition duration-200"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          )}
          {loading && (
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800 shadow-lg mt-[15dvh] p-6 rounded-lg w-full min-h-[200px]">
              <div className="font-bold text-lg">
                <span className="text-gray-600 dark:text-gray-300">
                  Loading...
                </span>
              </div>
            </div>
          )}
          {!error && !loading && profileData && (
            <div className="flex flex-col bg-white dark:bg-black shadow-md my-0 md:my-4 px-4 rounded-lg min-h-screen">
              <div className="flex justify-between items-center gap-4 p-4">
                <div className="flex items-center gap-4">
                  <div
                    onClick={handleBackClick}
                    className="text-gray-500 cursor-pointer"
                  >
                    <ArrowBackSharp className="text-2xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-xl">{profileData?.fullname}</p>
                    <span className="text-gray-600 text-sm">
                      {/* {profileData?.postsCount}{" "} */}
                      {/* {profileData?.postsCount === 1 ? "post" : "posts"} */}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  {isMyProfile && (
                    <div className="flex justify-center gap-4 px-5">
                      <div className="group relative">
                        <button
                          className="flex justify-center items-center gap-2 p-1 rounded-full font-medium text-slate-500 text-sm transition"
                          onClick={handleReceivedRequestsModelOpen}
                        >
                          <Send className="w-2 h-2 rotate-180" />
                        </button>
                        <span className="-top-8 left-1/2 absolute bg-gray-800 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs whitespace-nowrap transition -translate-x-1/2 duration-200">
                          Received Requests
                        </span>
                      </div>

                      <div className="group relative">
                        <button
                          className="flex justify-center items-center gap-2 p-1 rounded-full font-medium text-slate-500 text-sm transition"
                          onClick={handleSentRequestsModelOpen}
                        >
                          <Send className="w-2 h-2" />
                        </button>
                        <span className="-top-8 left-1/2 absolute bg-gray-800 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-md text-white text-xs whitespace-nowrap transition -translate-x-1/2 duration-200">
                          Sent Requests
                        </span>
                      </div>
                    </div>
                  )}

                  {isMyProfile && (
                    <Link
                      to="/settings"
                      className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition duration-200 cursor-pointer"
                    >
                      <Settings className="text-2xl" />
                    </Link>
                  )}
                </div>
              </div>

              {!isMyProfile && profileType === "PRIVATE" && (
                <div className="flex justify-center items-center gap-2 bg-gray-100 dark:bg-gray-900 mt-4 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lock fontSize="small" />
                    <p className="font-medium">This Profile is Private</p>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="group relative">
                  <img
                    src={coverImage}
                    alt="Cover Image"
                    className="w-full h-52 md:h-64 lg:h-72 object-cover"
                  />
                  {isMyProfile && (
                    <>
                      <label
                        htmlFor="cover-upload"
                        className="hidden group-hover:block right-3 bottom-3 absolute bg-black/50 p-2 rounded-full text-white cursor-pointer"
                      >
                        <Edit />
                      </label>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverImageChange}
                      />
                    </>
                  )}
                </div>
                <div className="top-40 md:top-44 lg:top-48 left-5 md:left-10 lg:left-16 absolute">
                  <div className="group relative border-4 border-gray-200 dark:border-gray-800 rounded-full w-24 md:w-32 lg:w-40 h-24 md:h-32 lg:h-40 overflow-hidden">
                    <img
                      src={profileImage}
                      alt="Profile Image"
                      className="w-full h-full object-cover"
                    />
                    {isMyProfile && (
                      <>
                        <label
                          htmlFor="profile-upload"
                          className="hidden group-hover:block right-3 bottom-3 absolute bg-black/50 p-2 rounded-full text-white cursor-pointer"
                        >
                          <Edit />
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImageChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 mt-10 px-6 h-10">
                {!isMyProfile && (
                  <button
                    onClick={followStatusClickHandler}
                    className={`flex items-center gap-2 min-[410px]:px-4  px-2 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md
                      ${
                        followStatus === "FOLLOWED"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                      ${
                        followStatus === "NOT_FOLLOWED"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : ""
                      }
                      ${
                        followStatus === "REQUEST_SENT"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : ""
                      }
                  `}
                  >
                    {followStatus === "FOLLOWED" && (
                      <>
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="hidden md:inline">Following</span>
                      </>
                    )}
                    {followStatus === "NOT_FOLLOWED" && (
                      <>
                        <PersonAdd className="w-5 h-5 text-white" />
                        <span className="hidden md:inline">Follow</span>
                      </>
                    )}
                    {followStatus === "REQUEST_SENT" && (
                      <>
                        <HourglassEmpty className="w-5 h-5 text-white" />
                        <span className="hidden md:inline">Requested</span>
                      </>
                    )}
                  </button>
                )}

                {!isMyProfile && (
                  <Link to={`/chat/${profileData.id}`}>
                    <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 shadow-md px-5 py-2 rounded-full font-medium text-white text-sm hover:scale-105 transition duration-200 transform">
                      <Email />
                      Message
                    </button>
                  </Link>
                )}

                {isMyProfile &&
                  (profileImageFile || coverImageFile || isEditable) && (
                    <button
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 shadow-md ml-3 px-4 py-2 rounded-full text-white text-sm transition duration-200"
                      onClick={updateHandler}
                      aria-label="Update profile"
                    >
                      Update
                    </button>
                  )}

                {isMyProfile &&
                  (profileImageFile || coverImageFile || isEditable) && (
                    <button
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 shadow-md px-4 py-2 rounded-full text-white text-sm transition duration-200"
                      onClick={handleCancel}
                      aria-label="Cancel changes"
                    >
                      Cancel
                    </button>
                  )}

                {isMyProfile && (
                  <div
                    className="hover:bg-gray-200 p-2 rounded-full"
                    onClick={toogleEditable}
                  >
                    <Edit />
                  </div>
                )}
              </div>

              <div className="p-4">
                {!isEditable && (
                  <div className="px-1 pb-1 font-bold text-2xl">
                    {profileData?.fullname}
                  </div>
                )}
                {isMyProfile && isEditable && (
                  <input
                    type="text"
                    placeholder="Fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="block bg-gray-200 dark:bg-gray-800 px-1 pb-1 rounded-lg font-bold text-2xl"
                  />
                )}

                <span className="px-1 text-gray-500 text-sm">
                  @{profileData?.username}
                </span>

                {profileType === "PUBLIC" && profileData?.email && (
                  <p className="mt-2 px-1 text-gray-700 dark:text-gray-300">
                    {profileData?.email}
                  </p>
                )}

                {profileType === "PUBLIC" && (
                  <>
                    {!isEditable && profileData?.bio && (
                      <p className="mt-2 p-1 text-gray-700 dark:text-gray-300 text-sm">
                        {profileData?.bio}
                      </p>
                    )}
                    {isMyProfile && isEditable && (
                      <textarea
                        value={bio}
                        placeholder="Bio"
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-gray-200 dark:bg-gray-800 mt-2 p-1 rounded-lg outline-none w-full text-gray-700 dark:text-gray-300 text-sm"
                      />
                    )}
                  </>
                )}

                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-6 pt-2">
                  {profileType === "PUBLIC" && (
                    <>
                      {(profileData?.link || (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable && profileData?.link && (
                            <a
                              href={profileData.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 p-1 rounded-lg text-blue-500 text-sm hover:underline"
                            >
                              <LinkIcon className="text-gray-500" />
                              {profileData.link}
                            </a>
                          )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg text-sm">
                              <LinkIcon className="text-gray-500" />
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="bg-transparent outline-none w-full text-blue-500"
                                placeholder="Link"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {profileType === "PUBLIC" && (
                    <>
                      {(profileData?.dateOfBirth ||
                        (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable && profileData?.dateOfBirth && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <CalendarToday />
                              <span>
                                DOB{" "}
                                {new Date(
                                  profileData?.dateOfBirth
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg text-sm">
                              <CalendarToday className="text-gray-500" />
                              <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="bg-transparent outline-none w-full text-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {profileType === "PUBLIC" && (
                    <>
                      {(profileData?.gender || (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable &&
                            profileData?.gender &&
                            profileData.gender !== "PREFER_NOT_TO_SAY" && (
                              <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <span>
                                  {profileData.gender === "MALE" && <Male />}
                                  {profileData.gender === "FEMALE" && (
                                    <Female />
                                  )}
                                  {profileData.gender === "OTHER" && (
                                    <Transgender />
                                  )}
                                  {" " + profileData.gender}
                                </span>
                              </div>
                            )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg text-sm">
                              <span>Gender:</span>
                              <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="bg-transparent outline-none text-blue-500"
                              >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                                <option value="PREFER_NOT_TO_SAY">
                                  Prefer not to say
                                </option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  {isMyProfile ? (
                    <>
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={handleFollowingsModelOpen}
                      >
                        <span className="font-bold">
                          {profileData?.followingsCount}
                        </span>
                        Following
                      </div>
                      <div
                        className="flex items-center gap-1 text-sm cursor-pointer"
                        onClick={handleFollowersModelOpen}
                      >
                        <span className="font-bold">
                          {profileData?.followersCount}
                        </span>
                        Followers
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-bold">
                          {profileData?.followingsCount}
                        </span>
                        Following
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-bold">
                          {profileData?.followersCount}
                        </span>
                        Followers
                      </div>
                    </>
                  )}
                </div>
              </div>

              <ProfileTabs
                userId={userId}
                isMyProfile={isMyProfile}
                profileType={profileType}
              />
            </div>
          )}
        </div>
      </div>
      <RequestsModel
        type="SENT"
        isOpen={isSentRequestsModelOpen}
        closeModal={handleSentRequestsModelClose}
      />
      <RequestsModel
        type="RECEIVED"
        isOpen={isReceivedRequestsModelOpen}
        closeModal={handleReceivedRequestsModelClose}
      />
      <ConnectionsModel
        type="FOLLOWER"
        isOpen={isFollowersModelOpen}
        closeModal={handleFollowersModelClose}
      />
      <ConnectionsModel
        type="FOLLOWING"
        isOpen={isFollowingsModelOpen}
        closeModal={handleFollowingsModelClose}
      />
    </MainLayout>
  );
};

export default ProfilePage;
