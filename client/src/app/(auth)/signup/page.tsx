"use client";

import NextLink from "next/link";
import {
  Box,
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
  Checkbox,
  HStack,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Eye, EyeSlash } from "iconsax-react";
import { useEffect, useState } from "react";
import { APIData, SignUpDto } from "@/data/dto/login.dto";
import { signup } from "@/data/managers/auth";
import { useRouter } from "next/navigation";
import { getVisitorData } from "@/app/utils/visitorAPI";
import Blur from "@/app/components/common/Blur";

export default function JoinOurTeam() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<SignUpDto>({
    email: "",
    password: "",
    twofactor: true,
    name: "",
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
    const res: APIData = await signup(data);
    if (res.status) {
      toast({
        title: "Signup Successful",
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
      toast({
        title: "Signup Failed",
        description: res.msg,
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
              Let's get started
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
                placeholder="Firstname Lastname"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                name="name"
                onChange={handleChange}
                value={data.name}
              />
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
              <Checkbox
                colorScheme="pink"
                isChecked={data.twofactor}
                onChange={() =>
                  setData({ ...data, twofactor: !data.twofactor })
                }
              >
                Enable 2FA using email
              </Checkbox>
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
            <HStack justify="center" mt={8}>
              <Text> Already have an Account ? </Text>{" "}
              <Link as={NextLink} href="/login">
                Login
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
