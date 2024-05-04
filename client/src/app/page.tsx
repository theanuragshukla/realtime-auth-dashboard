"use client";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Blur from "./components/common/Blur";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Box pos="relative" p={8}>
      <VStack mx="auto" maxW="800px" gap={4} align="center">
        <Heading> Realtime Auth Dashboard </Heading>
        <Text align="center">
          A complete Authentication + Authorisation system equipped with state
          of the art, realtime monitoring system, providing seamless control
          over all your accounts and devices
        </Text>
        <Button
          mt={16}
          onClick={() => {
            router.push("/dashboard");
          }}
          colorScheme="pink"
          variant="outline"
        >
          {" "}
          Get Started{" "}
        </Button>
      </VStack>
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
    </Box>
  );
}
