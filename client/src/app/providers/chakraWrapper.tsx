"use client";
import React from "react";
import { CSSReset, ChakraProvider, extendTheme } from "@chakra-ui/react";

export const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={extendTheme({})}>
    <CSSReset />
    {children}
  </ChakraProvider>
);
