import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { Fragment, ReactNode, useEffect } from "react";

import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SidebarDrawer from "../components/SidebarDrawer";
import Widget from "../components/Widget";
import { useAppSelector } from "../redux/store";

export default function Main({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isLogin) {
      return navigate("/");
    }
  }, []);

  return (
    <Fragment>
      <Flex color="white" h={"100vh"}>
        <Sidebar />
        {children}
        <Widget />
        <Button
          display={{ base: "flex", lg: "none" }}
          justifyContent={"center"}
          alignItems={"center"}
          color={"green"}
          size={"sm"}
          position={"fixed"}
          bottom={"50vh"}
          borderTopStartRadius={0}
          borderBottomStartRadius={0}
          py={5}
          onClick={onOpen}
        >
          <Text fontSize={"xl"}>
            <BsFillArrowRightSquareFill />
          </Text>
        </Button>
        <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg={"#2B2B2B"}>
            <DrawerCloseButton color={"white"} />
            <DrawerHeader borderBottomWidth={"3px"}>
              <Link to={"/"}>
                <Heading as="h2" size="3xl" noOfLines={1} color={"#2C7865"} mb={4}>
                  Circle
                </Heading>
              </Link>
            </DrawerHeader>
            <DrawerBody mt={4} w={"100%"} p={0}>
              <SidebarDrawer closeDrawer={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Fragment>
  );
}
