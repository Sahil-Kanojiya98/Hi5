import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import { FaArrowLeft } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import axiosInstance from "../utils/axiosConfig";
import ProfileHeaderSkeleton from "../components/skeletons/ProfileHeaderSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import Posts from "../components/Posts";

const ProfilePage = () => {
  const authUser = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [feedType, setFeedType] = useState("posts");
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/user/${id}`);
        setUser(response.data);
        console.log(response.data);

        if (id === authUser.id) {
          setIsMyProfile(true);
        } else {
          setIsMyProfile(false);
        }
        setPostsCount(response.data.postsCount);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [authUser, id]);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      if (state === "coverImg") {
        setCoverImg(file);
      } else if (state === "profileImg") {
        setProfileImg(file);
      }
    }
  };

  const dispatch = useDispatch();

  const follow = async () => {
    setIsPending(true);
    try {
      const updatedUser = {
        ...user,
        followingFlag: true,
        followersCount: user.followersCount + 1,
      };
      setUser(updatedUser);
      const response = await axiosInstance.post(`/user/follow/${user.id}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsPending(false);
    }
  };

  const unfollow = async () => {
    setIsPending(true);
    try {
      const updatedUser = {
        ...user,
        followingFlag: false,
        followersCount: user.followersCount - 1,
      };
      setUser(updatedUser);
      const response = await axiosInstance.post(`/user/unfollow/${user.id}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setIsPending(false);
    }
  };

  const updateImages = async () => {
    setIsUpdatingProfile(true);
    const formData = new FormData();
    console.log(coverImg, profileImg);
    console.log(coverImg instanceof File);
    console.log(profileImg instanceof File);
    if (coverImg) formData.append("coverPicture", coverImg);
    if (profileImg) formData.append("profilePicture", profileImg);
    try {
      const response = await axiosInstance.post(
        "/user/update-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Images updated:", response.data);
      if (response.data.profilePictureUrl) {
        const updatedUserProfile = {
          ...user,
          profilePictureUrl: response.data.profilePictureUrl,
          coverPictureUrl: response.data.coverPictureUrl,
        };
        setUser(updatedUserProfile);
        const updatedAuthUserProfile = {
          ...authUser,
          profilePictureUrl: response.data.profilePictureUrl,
        };
        dispatch(updateUser(updatedAuthUserProfile));
        setCoverImg(null);
        setProfileImg(null);
      }
    } catch (error) {
      console.error("Error updating images:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const reduceCount = () => {
    setPostsCount((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  return (
    <div className="flex-[4_4_0] border-r mr-auto border-gray-700 min-h-[calc(100vh+1px)] ">
      {isLoading && <ProfileHeaderSkeleton />}
      {!isLoading && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      <div className="flex flex-col">
        {!isLoading && user && (
          <>
            <div className="flex gap-10 px-4 py-2 items-center">
              <Link to="/">
                <FaArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg">{user.fullname}</p>
                <span className="text-sm text-slate-500">
                  {postsCount} posts
                </span>
              </div>
            </div>
            <div className="relative group/cover">
              <img
                src={
                  coverImg
                    ? URL.createObjectURL(coverImg)
                    : user.coverPictureUrl
                    ? "http://localhost:8080" + user.coverPictureUrl
                    : "/cover.png"
                }
                className="h-52 w-full object-cover"
                alt="cover image"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar">
                  <img
                    src={
                      profileImg
                        ? URL.createObjectURL(profileImg)
                        : user.profilePictureUrl
                        ? "http://localhost:8080" + user.profilePictureUrl
                        : "/avatar.png"
                    }
                    alt="profile"
                  />
                  {isMyProfile && (
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      <MdEdit
                        className="w-4 h-4 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end px-4 mt-5">
              {isMyProfile && (
                <EditProfileModal
                  authUser={{
                    fullName: user.fullname,
                    username: user.username,
                    email: user.email,
                    bio: user.bio || "",
                    link: user.link || "",
                  }}
                />
              )}

              {!isMyProfile && (
                <button
                  className="btn btn-outline rounded-full btn-sm"
                  onClick={async () => {
                    if (isPending) return;
                    if (user.followingFlag) {
                      await unfollow();
                    } else {
                      await follow();
                    }
                  }}
                >
                  {isPending
                    ? "Loading..."
                    : user.followingFlag
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}

              {(coverImg || profileImg) && isMyProfile && (
                <button
                  className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                  onClick={updateImages}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-xl">{user.fullname}</span>
                <span className="text-sm text-slate-500 py-3">
                  @{user.username}
                </span>
                <span className="text-sm my-1">
                  {user.bio || "No bio available"}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {user.link && (
                  <div className="flex gap-1 items-center">
                    <FaLink className="w-3 h-3 text-slate-500" />
                    <a
                      href={user.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {user.link}
                    </a>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user.followingsCount}
                  </span>
                  <span className="text-slate-500 text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user.followersCount}
                  </span>
                  <span className="text-slate-500 text-xs">Followers</span>
                </div>
              </div>
            </div>
            <div className="flex w-full border-b border-gray-700 mt-4">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("posts")}
              >
                Posts
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                )}
              </div>
            </div>
            <div className="mt-8">
              <Posts
                feedType={feedType}
                userId={id}
                isMyPost={isMyProfile}
                reduceCount={reduceCount}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
