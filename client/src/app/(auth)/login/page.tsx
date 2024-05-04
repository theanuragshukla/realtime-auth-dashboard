"use client";

import NextLink from "next/link";
import {
  Box,
  HStack,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  InputRightElement,
  InputGroup,
  IconButton,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Eye, EyeSlash } from "iconsax-react";
import { useEffect, useState } from "react";
import { APIData, LoginDto } from "@/data/dto/login.dto";
import { useRouter } from "next/navigation";
import { login } from "@/data/managers/auth";
import { getVisitorData } from "@/app/utils/visitorAPI";
import Blur from "@/app/components/common/Blur";

export default function Login() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<LoginDto>({
    email: "",
    password: "",
    device_details: {},
  });
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const res: APIData = await login(data);
    if (res.status) {
      toast({
        title: "Login Successful",
        duration: 3000,
        isClosable: true,
        status: "success",
      });
      if (res.redirect) {
        router.push(res.redirect);
      } else {
        router.push("/dashboard");
      }
    } else {
      console.log(res.data);
      toast({
        title: "Login Failed",
        description: `${res.msg}! ${
          // @ts-ignore
          res.msg === "Validation failed"
            ? // @ts-ignore
              res.data.issues[0].path[0] + " " + res.data.issues[0].message
            : ""
        }`,
        duration: 3000,
        isClosable: true,
        status: "error",
      });
    }
  };

  useEffect(() => {
    const getDeviceDetails = async () => {
      const details = await getVisitorData();
      setData((obj) => ({
        ...obj,
        device_details: details as Object,
      }));
    };
    getDeviceDetails();
  }, []);

  return (
    <Box position={"relative"}>
      <Container as={SimpleGrid} maxW={"7xl"} py={{ base: 10, sm: 20, lg: 32 }}>
        <Stack
          mx="auto"
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Let&apos;s get started
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              Login with your credentials to continue your journey.
            </Text>
          </Stack>
          <Box as={"form"} mt={10}>
            <Stack spacing={4}>
              <Input
                placeholder="firstname@lastname.io"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                name="email"
                onChange={handleChange}
                value={data.email}
              />
              <InputGroup>
                <Input
                  placeholder="Password"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type={show ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                />
                <InputRightElement>
                  <IconButton
                    onClick={() => setShow(!show)}
                    aria-label={"Show password"}
                    icon={show ? <Eye /> : <EyeSlash />}
                  />
                </InputRightElement>
              </InputGroup>
            </Stack>
            <Button
              onClick={handleSubmit}
              fontFamily={"heading"}
              mt={8}
              w={"full"}
              bgGradient="linear(to-r, red.400,pink.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, red.400,pink.400)",
                boxShadow: "xl",
              }}
            >
              Submit
            </Button>
            <HStack color="grey" justify="center" mt={8}>
              <Text>Don&apos;t have an Account ? </Text>{" "}
              <Link as={NextLink} href="/signup">
                Register
              </Link>{" "}
            </HStack>
          </Box>
        </Stack>
      </Container>
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
    </Box>
  );
}
