import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import { BiSolidHandUp } from "react-icons/bi";
import Comment from "../components/Comment";

function PostPage() {
  const [liked, setLiked] = useState();
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" name="Mark Zukerberg" size={"md"} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              markzuckerberg
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>Lets's talk about Threads.</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/post1.png"} w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          384 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {286 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4}/>
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"}>🚀</Text>
            <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>
            Get
        </Button>
      </Flex>
      <Divider py={3}/>
      <Comment comment={"this is the good image!"} createdAt={"1d"} likes={48} userName={"Sahil Kanojiya"} userAvatar={"https://bit.ly/prosper-baba"} />
      <Comment comment={"it can be better!"} createdAt={"1m"} likes={458} userName={"john deo"} userAvatar={"https://bit.ly/dan-abramov"} />
      <Comment comment={"hello bro nice pic!"} createdAt={"1mo"} likes={7} userName={"leo world"} userAvatar={"https://bit.ly/ryan-florence"} />
      <Comment comment={"this is the good image!"} createdAt={"1d"} likes={480} userName={"freefire_official"} userAvatar={"https://bit.ly/prosper-baba"} />
    </>
  );
}

export default PostPage;
