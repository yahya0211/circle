import { Fragment } from "react";
import { Alert, AlertDescription, AlertIcon, Box, Flex, Spinner, Text, Image } from "@chakra-ui/react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useDetailThread } from "../hooks/useThread";
import { BsArrowLeft } from "react-icons/bs";
import ReplyForm from "./ReplyForm";
import ReplyItem from "./ReplyItem";

export default function Reply() {
  const params = useParams();

  const { isLoading, data: thread, isError, error } = useDetailThread(params.threadId || "");


  return (
    <Fragment>
      <Box flex={1} px={5} py={10} overflow={"auto"} className="hide-scroll">
        <Flex gap={"3"} alignItems={"center"} mb={4}>
          <Link to={"/"}>
            <Text fontSize={"2xl"}>
              <BsArrowLeft />
            </Text>
          </Link>
          <Text fontSize={"2xl"}>Detail Thread</Text>
        </Flex>

        <Flex gap={"15px"} border={"2px solid #3a3a3a"} p={"20px"} mb={"10px"}>
          {isLoading ? (
            <Box textAlign={"center"}>
              <Spinner size={"xl"} />
            </Box>
          ) : (
            <>
              {isError ? (
                <Alert status="error" bg={"#FF6969"} mb={3} borderRadius={5}>
                  <AlertIcon color={"white"} />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <Image borderRadius={"full"} boxSize={"40px"} objectFit={"cover"} src={`${thread?.data?.user?.photo_profile}`} alt={`Profile Picture`} />
                  <Box>
                    <Flex mb={"10px"}>
                      <Link to={`/profile/${thread?.data?.user?.id}`}>
                        <Text fontWeight={"bold"} me={"10px"}>
                          {thread?.data?.user.fullname}
                        </Text>
                      </Link>
                      <Box mt={"2px"} fontSize={"sm"} color={"grey.400"}>
                        <Link to={`/profile/${thread?.data?.id}`}>@{thread?.data?.replies.user?.username}</Link> -{" "}
                        <Text display={"inline-block"} title={thread?.data?.user.created_at}>
                          {moment(new Date(thread?.data?.user.created_at)).calendar()}
                        </Text>
                      </Box>
                    </Flex>
                    <Text fontSize={"sm"} mb={"10px"} wordBreak={"break-word"}>
                      {thread?.data?.images ? <Image borderRadius="5px" boxSize="550px" objectFit="cover" src={thread.data.images} alt={`${thread.data.images} Thread Image`} mb={"10px"} /> : ""}
                    </Text>
                  </Box>
                </>
              )}
            </>
          )}
        </Flex>
        <Flex flexDir={"column"}>
          <Box border={"2px solid #3a3a3a"} p={"20px"} mb={"10px"}>
            <ReplyForm threadId={params.threadId || ""} />
          </Box>
          {!isLoading && !isError ? (
            <>
              {thread.data.replies.map((reply: ThreadReplyType) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </>
          ) : null}
        </Flex>
      </Box>
    </Fragment>
  );
}
