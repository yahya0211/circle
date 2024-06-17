import { Box, Card, CardBody, Image, Text } from "@chakra-ui/react";
import { Fragment } from "react";

//icons
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Watermark() {
  return (
    <Fragment>
      <Card bg={"rgb(38, 38, 38)"} color={"white"}>
        <CardBody py={4} px={5}>
          <Box fontSize={"md"}>
            Developed by Yahya - {""}
            <Link to="https://github.com/yahya0211">
              <FaGithub style={{ display: "inline", marginRight: "5px" }} />
            </Link>
            <Link to="https://www.linkedin.com/in/yahya-agung-nadabunda/">
              <FaLinkedin style={{ display: "inline", marginRight: "5px" }} />
            </Link>
          </Box>
          <Text fontSize={"xs"} color={"gray.400"} display={"inline"}>
            Powered by <Image src="../public/Red.png" alt="Dumbways Logo" width={"25px"} display={"inline"} position={"relative"} bottom={"-3px"} /> Dumbways Indonesia. #1 Coding Bootcamp
          </Text>
        </CardBody>
      </Card>
    </Fragment>
  );
}
