import { Link } from "react-router-dom";

const users = [
  {
    id: 1,
    fullName: "Alice Johnson",
    username: "@alice",
    profileImage: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    fullName: "Bob Smith",
    username: "@bob",
    profileImage: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    fullName: "Charlie Brown",
    username: "@charlie",
    profileImage: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 4,
    fullName: "Diana Ross",
    username: "@diana",
    profileImage: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 5,
    fullName: "Ethan Lee",
    username: "@ethan",
    profileImage: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 6,
    fullName: "Fiona White",
    username: "@fiona",
    profileImage: "https://i.pravatar.cc/100?img=6",
  },
];

const RightPanel = () => {
  return (
    <div className="lg:block hidden mt-5 w-72 min-w-60">
      <div className="bg-white dark:bg-black shadow-md p-4 rounded-md">
        <p className="mb-4 font-bold text-lg">You Might Know</p>
        <div className="flex flex-col space-y-5">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage}
                  alt={`${user.fullName}'s Profile`}
                  className="rounded-full w-10 h-10 object-cover"
                />
                <div>
                  <span className="block font-medium text-sm truncate">
                    {user.fullName}
                  </span>
                  <span className="block text-gray-400 text-xs truncate">
                    {user.username}
                  </span>
                </div>
              </div>
              <Link
                to="#"
                className="bg-gray-200 dark:bg-gray-800 hover:opacity-90 px-4 py-1 rounded-full font-semibold text-black text-sm dark:text-white transition duration-200"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
