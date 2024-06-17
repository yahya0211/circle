import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, Image, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getDetailUser } from "../../../redux/user/detailUserSlice";
import getError from "../../../utils/GetError";
import { API } from "../../../utils/api";

export const FollowPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const jwtToken = localStorage.getItem("jwtToken");

  const { data: detailUser, isLoading, isError, error } = useAppSelector((state) => state.detailUser);

  const [followerArray, setFollowerArray] = useState<any[]>([]);
  const [followingArray, setFollowingArray] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getDetailUser(params.userId || ""));
  }, [params, dispatch]);

  useEffect(() => {
    const fetchFollowerData = async () => {
      const followers = detailUser?.follower ?? [];
      const fetchedFollowerArray = await Promise.all(
        followers.map(async (follower: any) => {
          try {
            const response = await API.get(`findByUserId/${follower.followingId}`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            return response.data.data;
          } catch (error) {
            console.error("Error fetching follower data:", getError(error));
            return null;
          }
        })
      );
      setFollowerArray(fetchedFollowerArray.filter(Boolean));
    };

    const fetchFollowingData = async () => {
      const followings = detailUser?.followwing ?? [];
      const fetchedFollowingArray = await Promise.all(
        followings.map(async (followwing: any) => {
          try {
            const response = await API.get(`findByUserId/${followwing.followerId}`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            return response.data.data;
          } catch (error) {
            console.error("Error fetching following data:", getError(error));
            return null;
          }
        })
      );
      setFollowingArray(fetchedFollowingArray.filter(Boolean));
    };

    if (detailUser) {
      fetchFollowerData();
      fetchFollowingData();
    }
  }, [detailUser, jwtToken]);

  return (
    <Box width={"50%"} marginTop={50}>
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
            <Tabs>
              <TabList display="flex" justifyContent="space-evenly" px={4}>
                <Tab color={"white"}>
                  <Text display={"inline"}>Following ({detailUser?.followwing.length}) </Text>
                </Tab>
                <Tab color={"white"}>Followers ({detailUser?.follower.length}) </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box bg={"#2b2b2b"} mt={2} borderRadius={10} p={4}>
                    {!detailUser?.followwing.length ? (
                      <Text fontSize={"md"}>No Following Found</Text>
                    ) : (
                      followingArray.map((following, index) => (
                        <Flex key={index} justifyContent={"space-between"} alignItems={"center"} my={4} display={{ base: "block", sm: "flex" }}>
                          <Flex gap={2} alignItems={"center"} mb={{ base: 3, sm: 0 }}>
                            <Text>
                              <Image borderRadius="full" boxSize="45px" objectFit="cover" src={following?.photo_profile} alt={following.fullname} />
                            </Text>
                            <Box>
                              <Text fontSize={"sm"}>{following.fullname}</Text>
                              <Text fontSize={"sm"} color={"gray.400"}>
                                @{following.username}
                              </Text>
                            </Box>
                          </Flex>
                          <Text>
                            <Link to={`/profile/${following.id}`}>
                              <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size="sm" borderRadius={"full"} variant="outline">
                                Visit Profile
                              </Button>
                            </Link>
                          </Text>
                        </Flex>
                      ))
                    )}
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box bg={"#2b2b2b"} mt={2} borderRadius={10} p={4}>
                    {!detailUser?.follower.length ? (
                      <Text fontSize={"md"}>No follower found</Text>
                    ) : (
                      followerArray.map((follower, index) => (
                        <Flex key={index} justifyContent={"space-between"} alignItems={"center"} my={4} display={{ base: "block", sm: "flex" }}>
                          <Flex gap={2} alignItems={"center"} mb={{ base: 3, sm: 0 }}>
                            <Text>
                              <Image borderRadius="full" boxSize="45px" objectFit="cover" src={follower.photo_profile} alt={follower.fullname} />
                            </Text>
                            <Box>
                              <Text fontSize={"sm"}>{follower.fullname}</Text>
                              <Text fontSize={"sm"} color={"gray.400"}>
                                @{follower.username}
                              </Text>
                            </Box>
                          </Flex>
                          <Text>
                            <Link to={`/profile/${follower.id}`}>
                              <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size="sm" borderRadius={"full"} variant="outline">
                                Visit Profile
                              </Button>
                            </Link>
                          </Text>
                        </Flex>
                      ))
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </>
      )}
    </Box>
  );
};
