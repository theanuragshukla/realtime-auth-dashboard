"use client";

import { getRecentDevices, getDeviceDetail } from "@/data/managers/account";
import {
  Box,
  Button,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdSecurity } from "react-icons/md";
import { isArray } from "util";
import { logoutDevice } from "@/data/managers/account";
import { ACTIVITY_TYPE, DeviceDetails, Log } from "../utils/types";
import { DeviceCard } from "../components/common/DeviceCard";
import DeviceInfoModal from "../components/common/DeviceInfoModal";
import LiveMonitoring from "../components/common/LiveMonitoring";
import { useSearchParams } from "next/navigation";
import UserActivity from "../components/common/UserActivity";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [pages, setPages] = useState({ devices: 0, logs: 0 });
  const [ttlPages, setTtlPages] = useState({ devices: 1, logs: 1 });
  const [loading, setLoading] = useState({ devices: false, logs: false });
  const [devices, setDevices] = useState<DeviceDetails[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const deviceDetailsPopup = useDisclosure();
  const [deviceId, setDeviceId] = useState("");
  const [currentDevice, setCurrentDevice] = useState<Log>();
  const forUid = searchParams.get("forUid") || "";

  const signOutDevice = async (seed: string) => {
    const { status, msg } = await logoutDevice({
      id: seed,
      uid: forUid,
    });
    if (status) {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.seed === seed) {
            return { ...device, status: false };
          }
          return device;
        })
      );
    } else {
      console.error(msg);
    }
  };

  const loadDevices = async () => {
    setLoading((prev) => ({ ...prev, devices: true }));
    const { status, data, msg } = await getRecentDevices({
      page: pages.devices + 1,
      uid: forUid,
    });
    setPages((prev) => ({ ...prev, devices: prev.devices + 1 }));
    if (status && isArray(data)) {
      setDevices((prev) => [...prev, ...data] as DeviceDetails[]);
      if (data.length === 5) {
        setTtlPages((prev) => ({ ...prev, devices: prev.devices + 1 }));
      } else {
        setTtlPages((prev) => ({ ...prev, devices: prev.devices }));
      }
    } else {
      console.error(msg);
    }
    setLoading((prev) => ({ ...prev, devices: false }));
  };

  const addDevice = async (seed: string) => {
    const { status, data } = await getDeviceDetail({
      id: deviceId,
      uid: forUid,
    });
    if (status) {
      setDevices((prev) => {
        return [{ ...data, isCurrent: false, seed } as DeviceDetails, ...prev];
      });
    } else {
      console.error(data);
    }
  };

  const liveUpdate = (data: Log) => {
    console.log(data);
    setLogs((prev) => [data, ...prev]);
    if (
      [ACTIVITY_TYPE.REGISTER, ACTIVITY_TYPE.LOGIN_SUCCESS].includes(
        data.action
      )
    ) {
      addDevice(data.seed);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <Box px={{ base: 4, md: 8 }} pb={32} pt={16}>
      <VStack align="center" gap={8} pt={8} maxW="800px" mx="auto">
        <Icon as={MdSecurity} boxSize={24} color="pink.500" />
        <Heading size="lg">Manage Access and Devices</Heading>
        <Text textAlign="center" maxW="2xl" fontWeight={500}>
          These signed-in devices have recently been active on this account. You
          can sign out any of them by clicking the "Sign out" button". If you
          don't recognize a device, you should sign out of it.
        </Text>
        <LiveMonitoring onEvent={liveUpdate} />
        <Heading size="md">Recent Devices</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          {devices.map((device: DeviceDetails) => (
            <DeviceCard
              key={device.seed}
              device={device}
              onSignOut={() => signOutDevice(device.seed)}
              onClick={() => {
                setDeviceId(device.seed);
                setCurrentDevice({
                  seed: device.seed,
                  uid: forUid || "",
                  action: ACTIVITY_TYPE.LOGIN_SUCCESS,
                } as Log);
                deviceDetailsPopup.onOpen();
              }}
            />
          ))}
        </Grid>
        {pages.devices < ttlPages.devices && (
          <Button
            isLoading={loading.devices}
            onClick={loadDevices}
            colorScheme="blue"
            variant="outline"
          >
            Load more
          </Button>
        )}
        <UserActivity
          logs={logs}
          setLogs={(data: Log[]) => {
            setLogs((prev) => [...prev, ...data]);
          }}
        />
      </VStack>
      <DeviceInfoModal
        isOpen={deviceDetailsPopup.isOpen}
        onClose={deviceDetailsPopup.onClose}
        log={currentDevice}
      />
    </Box>
  );
}
