"use client";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/common/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Navbar />
      {children}
    </Box>
  );
}
