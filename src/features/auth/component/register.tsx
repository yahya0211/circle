import { useRegister } from "../hooks/useRegister";
import { Fragment, useEffect, useState } from "react";
import { Text, Alert, AlertIcon, AlertDescription, FormControl, Input, InputGroup, InputRightElement, Button, Box, Flex, Heading } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const { form, handleChange, handleRegister, isLoading, isError, Error, isRegisterSuccess } = useRegister();

  useEffect(() => {
    if (isRegisterSuccess) {
      navigate("/login");
    }
  }, []);
  return (
    <Fragment>
      <Flex justifyContent={"center"} alignItems={"center"} h={"100vh"}>
        <Box w={"100%"} maxWidth={"450px"} p={4} color={"white"}>
          <Heading as="h2" size="3xl" noOfLines={1} color={"green.400"} mb={3}>
            Circle
          </Heading>
          <Text fontSize={"xl"} mb={3}>
            Create Account Circle
          </Text>
          {isError && (
            <Alert status="error" bg={"#FF6969"} mb={3} borderRadius={5}>
              <AlertIcon color={"white"} />
              <AlertDescription>{Error}</AlertDescription>
            </Alert>
          )}
          <FormControl mb={4}>
            <Input type="text" placeholder="fullname" name="fullname" value={form.fullname} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4}>
            <Input type="text" placeholder="email" name="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl mb={4}>
            <InputGroup size="md">
              <Input type={show ? "text" : "password"} placeholder="password" name="password" value={form.password} onChange={handleChange} />
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
            <Button type="submit" colorScheme="green" variant="solid" borderRadius={"full"} w={"100%"} mb={3} onClick={handleRegister}>
              Register
            </Button>
          )}
          <Text>
            Already have account?{" "}
            <Link style={{ color: "#48bb78" }} to={"/login"}>
              Login
            </Link>
          </Text>
        </Box>
      </Flex>
    </Fragment>
  );
}
