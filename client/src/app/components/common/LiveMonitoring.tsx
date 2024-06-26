import { Log, RTM } from "@/app/utils/types";
import { connectSocket } from "@/socket/connection";
import { Button, HStack, Icon, Text, useToast } from "@chakra-ui/react";
import { Brodcast } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LiveMonitoring({
  room,
  onEvent,
}: {
  room?:string 
  onEvent: (data: Log) => void;
}) {
  const [rtm, setRtm] = useState<RTM>({ status: false });
  const toast = useToast();
  const searchParams = useSearchParams();
  const forUid = searchParams.get("forUid") || "";

  const handleClick = () => {
    if (rtm.status) {
      if (rtm.socket) rtm.socket.disconnect();
      setRtm({ status: false });
    } else {
      const socket = connectSocket({ uid: room || forUid });
      setRtm({ status: true, socket });
    }
  };

  useEffect(() => {
    if (!rtm.status) return;
    const { socket } = rtm;
    if (!socket) {
      return setRtm({ status: false });
    }

    socket.on("connect", () => {
      toast({
        title: "Activated Realtime Monitoring",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });

    socket.on("disconnect", () => {
      toast({
        title: "Deactivated Realtime Monitoring",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    });

    socket.on("event", onEvent);
    return () => {
      console.log("Disconnecting");
      if (rtm.status && rtm.socket) {
        rtm.socket.disconnect();
      }
    };
  }, [rtm]);

  return (
    <HStack
      boxShadow="md"
      w="100%"
      justifyContent="space-between"
      borderRadius="xl"
      p={8}
      align="center"
      gap={4}
    >
      <Text fontSize={16} fontWeight={700}>
        Realtime Monitoring {rtm.status ? "Enabled" : "Disabled"}
      </Text>
      <Button
        size="sm"
        variant={rtm.status ? "outline" : "solid"}
        onClick={handleClick}
        colorScheme={rtm.status ? "red" : "green"}
        leftIcon={<Icon as={Brodcast} />}
      >
        <Text>{rtm.status ? "Stop" : "Start"} Monitoring</Text>
      </Button>
    </HStack>
  );
}
