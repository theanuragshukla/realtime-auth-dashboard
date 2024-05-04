"use client";
import React from "react";
import { CSSReset, ChakraProvider, extendTheme } from "@chakra-ui/react";
import HomeLayout from "../layouts/HomeLayout";

export const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider
    theme={extendTheme({
      initialColorMode: "dark",
      useSystemColorMode: false,
    })}
  >
    <CSSReset />
    <HomeLayout>{children}</HomeLayout>
  </ChakraProvider>
);
