import { Fragment, useEffect } from "react";
import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, Text, Image, Spinner, Card, CardBody } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getProfile } from "../redux/user/profileSlice";

//icon
import { FiEdit3 } from "react-icons/fi";

export default function Profile() {
  const dispatch = useAppDispatch();

  const { data: profileData, isLoading, isError, error } = useAppSelector((state) => state.profile);
  console.log("Profile", isLoading);

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  return (
    <Fragment>
      <Card bg={"#3a3a3a"} color={"white"} mb={"15px"}>
        <CardBody py={4} px={5}>
          <Text fontSize={"xl"} mb={3}>
            My Profile
          </Text>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {isError ? (
                <Alert status="error" bg={"#FF6969"} mb={3} borderRadius={5}>
                  <AlertIcon color={"white"} />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <Box position={"relative"}>
                    <Image src="https://assets-global.website-files.com/5a9ee6416e90d20001b20038/635ab99b5920d1d2c6e04397_horizontal%20(66).svg" alt="Green Gradient" borderRadius={"10px"} w={"100%"} h={"80px"} objectFit={"cover"} />
                    <Image
                      borderRadius={"full"}
                      bgColor={"#3a3a3a"}
                      border={"5px solid #3a3a3a"}
                      boxSize={"75px"}
                      objectFit={"cover"}
                      src={profileData?.photo_profile}
                      alt={profileData?.fullname}
                      position={"absolute"}
                      top={"40px"}
                      left={"20px"}
                    />
                    <Link to={`/edit-profile`}>
                      <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size={"sm"} borderRadius={"full"} variant={"outline"} position={"absolute"} bottom={"-50px"} right={"0px"}>
                        <Text fontSize={"lg"}>
                          <FiEdit3 />
                        </Text>
                      </Button>
                    </Link>
                  </Box>
                  <Text fontSize={"2xl"} mt={"40px"} fontWeight={"bold"}>
                    {profileData?.fullname}
                  </Text>
                  <Text fontSize={"2xl"} mt={"40px"} fontWeight={"bold"}>
                    @{profileData?.fullname}
                  </Text>
                  <Text fontSize={"md"} mt={1}>
                    {profileData?.bio}
                  </Text>
                  <Flex mt={"10px"} gap={3}>
                    <Box fontSize={"md"}>
                      {profileData?.follower.length}{" "}
                      <Text display={"inline"} color={"gray.400"}>
                        Followers
                      </Text>
                    </Box>
                    <Box fontSize={"md"}>
                      {profileData?.followwing.length}{" "}
                      <Text display={"inline"} color={"gray.400"}>
                        Following
                      </Text>
                    </Box>
                  </Flex>
                </>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
}
