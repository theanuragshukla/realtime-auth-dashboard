"use client";

import { APIData } from "@/data/dto/login.dto";
import { verifyOtp } from "@/data/managers/auth";
import { Center, Heading, useToast } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const query = useSearchParams();
  const toast = useToast();
  const router = useRouter();
  const handleSubmit = async () => {
    const res: APIData = await verifyOtp({
      otp: otp,
      id: query.get("id") || "",
    });
    if (res.status) {
      toast({
        title: "2FA Successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "2FA Failed",
        description: res.msg || "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (res.redirect) {
        router.push(res.redirect);
      }
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={8}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          fontWeight="bold"
          color={useColorModeValue("gray.800", "gray.400")}
        >
          {query.get("email") || "<EMAIL REDACTED>"}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput
                type="alphanumeric"
                mask
                value={otp}
                onChange={(e: string) => {
                  setOtp(() => e);
                }}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6}>
          <Button onClick={handleSubmit} colorScheme="pink">
            Verify
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
