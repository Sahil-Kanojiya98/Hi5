import {
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

function UserHeader() {
  const toast = useToast();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Copied",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });

    // navigator.clipboard.writeText(currentURL).then(() => {
    //     toast({
    //       title: "Link Copied!",
    //       description: "The profile link has been copied to your clipboard.",
    //       status: "success",
    //       duration: 3000,
    //       isClosable: true,
    //       position: "bottom-right",
    //       containerStyle: {
    //         bg: "gray.800",
    //         color: "white",
    //         borderRadius: "md",
    //         boxShadow: "lg",
    //         p: 3,
    //       },
    //     });
    // });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"}>Mark Zukerberg</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>markzukerberg</Text>
            <Text
              fontSize={"xs"}
        
            //   responsive fonts
            //   fontSize={{
            //     base:"xs",
            //     md:"sm",
            //     lg:"md"
            //   }}
              fontWeight={"bold"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
            {/* here         size based responsiveness     */}
          <Avatar src="/zuck-avatar.png" name="Mark Zukerberg" size={{
            base:"md",
            md:"xl"
          }} />
        </Box>
      </Flex>
      <Text>Co-founder, executive chairman and CEO of meta platforms.</Text>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>3.2K followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <MenuList bg={"gray.dark"}>
                <MenuItem bg={"gray.dark"} onClick={copyURL}>
                  Copy Link
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
          <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
            <Text fontWeight={"bold"}>Threads</Text>
          </Flex>
          <Flex flex={1} borderBottom={"1px solid gray"} color={"gray.light"} justifyContent={"center"} pb={3} cursor={"pointer"}>
            <Text fontWeight={"bold"}>Replies</Text>
          </Flex>
        </Flex>
    </VStack>
  );
}

export default UserHeader;
