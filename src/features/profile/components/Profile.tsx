import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getDetailUser } from "../../../redux/user/detailUserSlice";
import { getProfile } from "../../../redux/user/profileSlice";
import { API } from "../../../utils/api";
import { Alert, AlertDescription, AlertIcon, Box, Button, Card, CardBody, Image, Spinner, Text } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import getError from "../../../utils/GetError";
import ProfilePanels from "./ProfilePanels";

export default function Profile() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const jwtToken = localStorage.getItem("jwtToken");

  const { data: detailUser, isLoading, isError, error } = useAppSelector((state) => state.detailUser);
  const { data: profile } = useAppSelector((state) => state.profile);

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

  const followAndUnfollow = async () => {
    try {
      await API.post(`follow/${params.userId}`, "", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      dispatch(getDetailUser(params.userId || ""));
      dispatch(getProfile());
    } catch (error) {
      toast.error(getError(error), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <Fragment>
      <Box flex={1} px={5} py={10} overflow={"auto"} className="hide-scroll">
        <Card bg={"#3a3a3a"} color={"white"} mb={"15px"}>
          <CardBody py={4} px={5}>
            <Text fontSize={"2xl"} mb={"10px"}>
              Profile
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
                        src={detailUser?.photo_profile}
                        alt={detailUser?.fullname}
                        position={"absolute"}
                        top={"40px"}
                        left={"20px"}
                      />

                      {profile?.id === detailUser?.id && (
                        <Link to={`/edit-profile`}>
                          <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size={"sm"} borderRadius={"full"} variant={"outline"} position={"absolute"} bottom={"-50px"} right={"0px"}>
                            <Text fontSize={"sm"}>{/* <FiEdit3 /> */} Edit profile</Text>
                          </Button>
                        </Link>
                      )}
                      {profile?.id !== detailUser?.id && (
                        <Button color={"white"} _hover={{ bg: "#38a169", borderColor: "#38a169" }} size={"sm"} borderRadius={"full"} variant="outline" position={"absolute"} bottom={"-50px"} right={"0px"} onClick={followAndUnfollow}>
                          {followerArray.map((follower) => follower.id).includes(profile?.id || "") ? "Unfollow" : "Follow"}
                        </Button>
                      )}
                    </Box>
                    <Box mt={10}>
                      <Text fontSize={"2xl"} color={"white"} fontWeight={"bold"}>
                        {detailUser?.fullname}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.400"}>
                        @{detailUser?.username}
                      </Text>
                      <Text fontSize={"lg"} color={"gray.400"}>
                        {detailUser?.bio}
                      </Text>
                    </Box>
                  </>
                )}
              </>
            )}
          </CardBody>
        </Card>
        <Box>
          <ProfilePanels />
        </Box>
      </Box>
    </Fragment>
  );
}
