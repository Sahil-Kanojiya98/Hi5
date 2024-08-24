import { Divider } from "@chakra-ui/react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

function UserPage() {
  return (
    <>
      <UserHeader />
      <UserPost likes={1200} replies={234} postImg={"/post1.png"} postTitle={"Let's talk about threads."} />
      <UserPost likes={123} replies={62} postImg={"/post2.png"} postTitle={"hello i am a programmer."} />
      <UserPost likes={34} replies={3} postImg={"/post3.png"} postTitle={"this is a common post."} />
    </>
  );
}

export default UserPage;



// import React, { useState } from "react";
// import { Divider, Skeleton, Box } from "@chakra-ui/react";
// import UserHeader from "../components/UserHeader";
// import UserPost from "../components/UserPost";
// import InfiniteScroll from "react-infinite-scroll-component";

// function UserPage() {
//   const [posts, setPosts] = useState([
//     {
//       likes: 1200,
//       replies: 234,
//       postImg: "/post1.png",
//       postTitle: "Let's talk about threads.",
//     },
//     {
//       likes: 123,
//       replies: 62,
//       postImg: "/post2.png",
//       postTitle: "hello i am a programmer.",
//     },
//     {
//       likes: 34,
//       replies: 3,
//       postImg: "/post3.png",
//       postTitle: "this is a common post.",
//     },
//   ]);

//   const [hasMore, setHasMore] = useState(true);

//   const fetchMorePosts = () => {
//     setTimeout(() => {
//       let newPosts = [
//         {
//           likes: 50,
//           replies: 12,
//           postImg: "/post4.png",
//           postTitle: "New post 1.",
//         },
//         {
//           likes: 89,
//           replies: 5,
//           postImg: "/post5.png",
//           postTitle: "New post 2.",
//         },
//         {
//           likes: 12,
//           replies: 1,
//           postImg: "/post6.png",
//           postTitle: "New post 3.",
//         },
//       ];

//       if (posts.length > 9) {
//         newPosts = [newPosts[0], newPosts[1]];
//       }

//       setPosts((prevPosts) => [...prevPosts, ...newPosts]);

//       // If there are no more posts to load
//       if (newPosts.length < 3) {
//         setHasMore(false);
//       }
//     }, 1500); // Simulate network request delay
//   };

//   return (
//     <>
//       <UserHeader />
//       <InfiniteScroll
//         dataLength={posts.length}
//         next={fetchMorePosts}
//         hasMore={hasMore}
//         loader={
//             //add sclaton here
//             <>loding</>
//         }
//         endMessage={
//           <p style={{ textAlign: "center" }}>
//             <b>You have seen it all</b>
//           </p>
//         }
//       >
//         {posts.map((post, index) => (
//           <UserPost
//             key={index}
//             likes={post.likes}
//             replies={post.replies}
//             postImg={post.postImg}
//             postTitle={post.postTitle}
//           />
//         ))}
//       </InfiniteScroll>
//     </>
//   );
// }

// export default UserPage;
