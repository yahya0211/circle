import { Box, Flex, Grid, GridItem, Image, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getDetailUser } from "../../../redux/user/detailUserSlice";
import { useDeleteThread, usePostLike } from "../../thread/hooks/useThread";
import moment from "moment";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import Swal from "sweetalert2";
import { RiDeleteBin5Line } from "react-icons/ri";
import { API } from "../../../utils/api";

const ProfilePanels = () => {
  const params = useParams<{ userId: string }>();
  const userId = params.userId || ""; // Use fallback value
  const dispatch = useAppDispatch();
  const jwtToken = localStorage.getItem("jwtToken");

  const [threads, setThreads] = useState<ThreadHomeType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data: profileData } = useAppSelector((state) => state.profile);

  const fetchThreads = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`findByUserId/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log("API Response:", response); // Log the entire response

      const threadData = response.data?.data.threads || [];
      console.log("threadData:", threadData);

      if (Array.isArray(threadData)) {
        setThreads(threadData);
      } else {
        throw new Error("Unexpected data format");
      }
    } catch (err) {
      console.error("Detailed Error:", err);
      setError("Failed to load threads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { mutate: likeThread } = usePostLike();
  const { mutate: deleteThread } = useDeleteThread();

  useEffect(() => {
    if (userId) {
      dispatch(getDetailUser(userId));
      fetchThreads();
    }
  }, [userId, dispatch]);

  return (
    <Tabs>
      <TabList display="flex" justifyContent="space-evenly">
        <Tab color="white" w="100%">
          <Text display="inline">Thread</Text>
        </Tab>
        <Tab color="white" w="100%">
          <Text display="inline">Media</Text>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box mt={2} borderRadius={10}>
            {loading && <Text>Loading threads...</Text>}
            {error && <Text color="red.500">{error}</Text>}
            {!loading && !error && threads.length === 0 && <Text>No threads found.</Text>}
            {Array.isArray(threads) &&
              threads?.map((thread) => (
                <Fragment key={thread.id}>
                  <Flex gap="15px" borderBottom="2px solid #3a3a3a" p="20px" mb="10px">
                    {thread.user && <Image borderRadius="full" boxSize="40px" objectFit="cover" src={thread.user.photo_profile} alt={`${thread.user.fullname} Profile Picture`} />}
                    <Box>
                      {thread.user && (
                        <Box display={{ base: "block", md: "flex" }} mb="5px">
                          <Link to={`/profile/${thread.user.id}`}>
                            <Text fontWeight="bold" me="10px">
                              {thread.user.fullname}
                            </Text>
                          </Link>
                          <Box mt="2px" fontSize="sm" color="gray.400">
                            <Link to={`/profile/${thread.user.id}`}>@{thread.user.username}</Link> -{" "}
                            <Text display="inline-block" title={thread.created_at}>
                              {moment(new Date(thread.created_at)).calendar()}
                            </Text>
                          </Box>
                        </Box>
                      )}
                      <Text fontSize="sm" mb="10px" wordBreak="break-word">
                        {thread.content}
                      </Text>
                      {/* Images */}
                      {thread.images?.length > 0 && (
                        <Box overflowX="auto" mb="20px" borderRadius="10px">
                          <Stack spacing={4} direction="row" overflowX="auto">
                            {thread.images.map((image, index) => (
                              <Box key={index} position="relative" flex="0 0 auto" minWidth="100px" p={2}>
                                <Image boxSize="300px" w="100%" objectFit="cover" src={image} alt={`Image ${index}`} borderRadius="10px" />
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}
                      {/* Like and Comment buttons */}
                      <Flex gap="15px">
                        <Flex alignItems="center">
                          <Box onClick={() => likeThread(thread.id.toString())} cursor="pointer">
                            {thread.isLiked ? (
                              <AiFillHeart
                                style={{
                                  fontSize: "20px",
                                  marginRight: "5px",
                                  marginTop: "1px",
                                }}
                              />
                            ) : (
                              <AiOutlineHeart
                                style={{
                                  fontSize: "20px",
                                  marginRight: "5px",
                                  marginTop: "1px",
                                }}
                              />
                            )}
                          </Box>
                          <Text cursor="pointer" fontSize="sm" color="gray.400">
                            {thread.like?.length}
                          </Text>
                        </Flex>
                        <Link to={`/reply/${thread.id}`}>
                          <Flex alignItems="center">
                            <BiCommentDetail
                              style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                marginTop: "1px",
                              }}
                            />
                            <Text fontSize="sm" color="gray.400">
                              {thread.replies?.length} Replies
                            </Text>
                          </Flex>
                        </Link>
                        {/* Delete Thread Button */}
                        {thread.user?.id === profileData?.id && (
                          <Flex
                            alignItems="center"
                            onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "This thread will be deleted permanently!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  deleteThread(thread.id);
                                }
                              });
                            }}
                            cursor="pointer"
                          >
                            <RiDeleteBin5Line
                              style={{
                                fontSize: "20px",
                                marginRight: "5px",
                                marginTop: "1px",
                              }}
                            />
                          </Flex>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Fragment>
              ))}
          </Box>
        </TabPanel>
        <TabPanel>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {threads.map((thread) => (
              <GridItem key={thread.id}>
                {thread.images?.map((image, index) => (
                  <Image key={index} src={image} />
                ))}
              </GridItem>
            ))}
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfilePanels;
