import { useEffect, useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Box, Button, Flex, FormControl, Heading, Input, InputGroup, InputRightElement, Text, Alert, AlertIcon, AlertDescription, Grid, GridItem, Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [show, setShow] = useState<boolean>(false);
  const { form, handleChange, handleLogin, isLoading, isError, Error, isLoginSuccess } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginSuccess) {
      navigate("/");
    }
  }, [isLoginSuccess, navigate]);

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem>
        <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
          <Image src="..\public\circle.png" alt="Dumbways Logo" width={"500px"} display={"inline"} position={"relative"} bottom={"-3px"} />
        </Flex>
      </GridItem>
      <GridItem>
        <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
          <Box w={"100%"} maxWidth={"450px"} p={4} color={"white"}>
            <Heading as="h2" size="3xl" noOfLines={1} color={"green.400"} mb={3}>
              Circle
            </Heading>
            <Text fontSize={"xl"} mb={3}>
              Login to Circle
            </Text>
            {isError && (
              <Alert status="error" bg={"#FF6969"} mb={3} borderRadius={5}>
                <AlertIcon color={"white"} />
                <AlertDescription>{Error}</AlertDescription>
              </Alert>
            )}
            <FormControl mb={4}>
              <Input type="text" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <InputGroup size="md">
                <Input type={show ? "text" : "password"} placeholder="Password" name="password" value={form.password} onChange={handleChange} />
                <InputRightElement w={"4.5rem"}>
                  <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {isLoading ? (
              <Button isLoading colorScheme="green" variant="solid" borderRadius={"full"} w={"100%"} mb={3}>
                Loading
              </Button>
            ) : (
              <Button type="submit" colorScheme="green" variant="solid" borderRadius={"full"} w={"100%"} mb={3} onClick={handleLogin}>
                Login
              </Button>
            )}
            <Text>
              Have no account?{" "}
              <Link style={{ color: "#48bb78" }} to={"/register"}>
                Register
              </Link>
            </Text>
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  );
}
