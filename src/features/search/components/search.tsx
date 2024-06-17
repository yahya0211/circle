import { Fragment, useState, useEffect } from "react";
import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, Input, InputGroup, InputLeftElement, Text, Image, Spinner, Card, CardBody } from "@chakra-ui/react";
import { useSearch } from "../hooks/useSearch";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MdPersonSearch } from "react-icons/md";
import { FaSearchPlus } from "react-icons/fa";

export default function Search() {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const [nameQuery, setNameQuery] = useState<string>(queryParams.get("search") || "");
  const [goReFetch, setGoReFetch] = useState<boolean>(false);

  const { isLoading, data: users, isError, error, refetch } = useSearch(nameQuery);

  useEffect(() => {
    setNameQuery(queryParams.get("search") || "");

    const timeout = setTimeout(() => {
      refetch();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [queryParams]);

  const applyFilter = () => {
    let url = "/search?";

    if (nameQuery) {
      url += `&search=${nameQuery}`;
    }
    

    navigate(url);
  };

  return (
    <Fragment>
      <Box flex={1} px={5} py={1} overflow={"auto"} className="hide-scroll">
        <Text fontSize={"2xl"} mb={"10px"}>
          Search user
        </Text>
        <Flex gap={2} mb={"20px"}>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"} fontSize={"20px"}>
              <MdPersonSearch />
            </InputLeftElement>
            <Input type="text" placeholder="username" borderRadius={"full"} value={nameQuery} onChange={(e) => setNameQuery(e.target.value)} />
          </InputGroup>
          <Button colorScheme="green" borderRadius={"full"} onClick={() => applyFilter()}>
            <FaSearchPlus />
          </Button>
        </Flex>
        <Card bg={"#3a3a3a"} color={"white"} mb={"15px"}>
          <CardBody py={2} px={5}>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {isError ? (
                  <Alert status="error" bg={"#3a3a3a"} borderRadius={5}>
                    <AlertIcon color={"white"} />
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {!users.data.length ? (
                      <Text fontSize={"md"}>No data found</Text>
                    ) : (
                      <>
                        {users.data.map((user: SearchUserType, index: number) => (
                          <Flex display={{ base: "block", sm: "flex" }} key={index} justifyContent={"space-between"} alignItems={"center"} my={5}>
                            <Flex gap={2} alignItems={"center"} mb={{ base: 3, sm: 0 }}>
                              <Text>
                                <Image borderRadius="full" boxSize={"45px"} objectFit="cover" src={user.photo_profile} alt={user.fullname} />
                              </Text>
                              <Box>
                                <Text fontSize={"sm"}>{user.fullname}</Text>
                                <Text fontSize={"sm"} color={"gray.400"}>
                                  @{user.username}
                                </Text>
                              </Box>
                            </Flex>
                            <Text>
                              <Link to={`/profile/${user.id}`}>
                                <Button
                                  color={"white"}
                                  _hover={{
                                    bg: "#38a169",
                                    borderColor: "#38a169",
                                  }}
                                >
                                  Visit Profile
                                </Button>
                              </Link>
                            </Text>
                          </Flex>
                        ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Box>
    </Fragment>
  );
}
