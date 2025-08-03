import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import "./SideDrawer.css";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  BellIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender, createdAt } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    setIsAuth,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setIsAuth(false);
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/user?search=${search}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#28293D"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
        borderColor="#555770"
        color="#EBEBF0"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} _hover={{ bg: "#555770" }}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          className="logo_text"
          fontSize="2.5rem"
          fontWeight="bold"
          textTransform="uppercase"
          display="inline-block"
          bgGradient="linear(to-r, #FF3B3B, #6600CC)"
          bgClip="text"
          cursor="pointer"
          textShadow="2px 2px 8px rgba(0, 0, 0, 0.6)"
        >
          ChatMind
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2} bg="#28293D" color="white">
              {!notification.length && <MenuItem>No New Messages</MenuItem>}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="transparent" _hover={{ bg: "#555770" }}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
              <ChevronDownIcon />
            </MenuButton>
            <MenuList bg="#28293D" border="none">
              <Box p={2} textAlign="center">
                <Avatar size="md" name={user.name} src={user.pic} mb={2} />
                <Box fontSize="sm">
                  <strong>ID:</strong> {user._id.slice(0, 8)} <br />
                  <strong>Name:</strong> {user.name} <br />
                  <strong>Email:</strong> {user.email} <br />
                  <strong>Created At:</strong> {createdAt(user)} <br />
                </Box>
              </Box>
              <MenuDivider />
              <ProfileModal user={user}>
                <MenuItem _hover={{ bg: "#555770" }}>
                  <EditIcon mr={2} boxSize={4} />
                  Profile
                </MenuItem>
              </ProfileModal>
              <MenuItem _hover={{ bg: "#555770" }}>
                <DeleteIcon mr={2} boxSize={4} />
                Delete Account
              </MenuItem>
              <MenuItem _hover={{ bg: "#555770" }}>
                <SettingsIcon mr={2} boxSize={4} />
                Settings
              </MenuItem>
              <MenuItem _hover={{ bg: "#555770" }} onClick={logoutHandler}>
                <ExternalLinkIcon mr={2} boxSize={4} />
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#28293D" color="#F2F2F5">
          <DrawerHeader
            borderBottomWidth="1px"
            fontWeight="bold"
            textTransform="uppercase"
            bgGradient="linear(to-r, #FF3B3B, #6600CC)"
            bgClip="text"
            textAlign="center"
            fontSize="2rem"
          >
            ChatMind
          </DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                color="#F2F2F5"
                bg="#555770"
              />
              <Button
                onClick={handleSearch}
                bg="#555770"
                color="#F2F2F5"
                _hover={{ bg: "#6600CC" }}
                _active={{ bg: "#6600CC" }}
                p={3}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((myuser) => (
                <UserListItem
                  key={myuser._id}
                  user={myuser}
                  handleFunction={() => accessChat(myuser._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
