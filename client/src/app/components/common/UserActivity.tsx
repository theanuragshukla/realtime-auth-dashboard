"use client";

import { Log } from "@/app/utils/types";
import { getAllActivities, getRecentActivities } from "@/data/managers/account";
import { VStack, Button, Heading, useDisclosure } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isArray } from "util";
import { LogCard } from "./LogCard";
import DeviceInfoModal from "./DeviceInfoModal";
export default function UserActivity({
  isAdmin,
  showUid,
  logs,
  setLogs,
}: {
  isAdmin?: boolean;
  showUid?: boolean;
  logs: Log[];
  setLogs: (data: Log[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const forUid = searchParams.get("forUid") || "";
  const [pages, setPages] = useState(0);
  const [ttlPages, setTtlPages] = useState(1);
  const deviceDetailsPopup = useDisclosure();
  const [currentLog, setCurrentLog] = useState<Log>();

  const loadActivities = async () => {
    setLoading(() => true);
    const { status, data, msg } = await (isAdmin
      ? getAllActivities({ page: pages + 1 })
      : getRecentActivities({
          page: pages + 1,
          uid: forUid,
        }));
    setPages((prev) => prev + 1);
    if (status && isArray(data)) {
      setLogs(data as Log[]);
      if (data.length === 20) {
        setTtlPages((prev) => prev + 1);
      }
    } else {
      console.error(msg);
    }
    setLoading(() => false);
  };

  useEffect(() => {
    loadActivities();
  }, []);
  return (
    <VStack w="100%">
      <Heading size="md">{isAdmin ? "All" : "Recent"} Activities</Heading>
      {logs.map((log: Log, index: number) => (
        <LogCard
          showUid={showUid || false}
          key={index}
          log={log}
          onClick={() => {
            setCurrentLog(() => log);
            deviceDetailsPopup.onOpen();
          }}
        />
      ))}
      {pages < ttlPages && (
        <Button
          isLoading={loading}
          onClick={loadActivities}
          colorScheme="blue"
          variant="outline"
        >
          Load more
        </Button>
      )}
      <DeviceInfoModal
        isOpen={deviceDetailsPopup.isOpen}
        onClose={deviceDetailsPopup.onClose}
        log={currentLog}
      />
    </VStack>
  );
}
