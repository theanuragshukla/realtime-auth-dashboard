"use client";

import { upgradeAccount } from "@/data/managers/account";
import { Box, Progress, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UpgradeAccount (){
  const toast = useToast()
  const router = useRouter()
  const upgrade = async () => {
    const {status, msg} = await upgradeAccount()
    toast({
      status: status? "success" : "error", 
      title: msg, 
      isClosable: true, duration: 3000
      })
    router.push("/dashboard")
  }
  useEffect(()=>{
upgrade()
    }, [])
  return (
  <Box>
  <Progress isIndeterminate w="100%" h={4}/>
  </Box>
  )
}
