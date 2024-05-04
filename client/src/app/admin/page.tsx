"use client";

import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  Show,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UsersTable from "../components/common/UsersTable";
import UsersList from "../components/common/UsersList";
import { ProfileCircle } from "iconsax-react";
import {
  deleteUserByUid,
  getAllUsers,
  getUserByUid,
} from "@/data/managers/account/users";
import { isArray } from "util";
import { ACTIVITY_TYPE, Log, User } from "../utils/types";
import { useRouter } from "next/navigation";
import LiveMonitoring from "../components/common/LiveMonitoring";
import UserActivity from "../components/common/UserActivity";
import Blur from "../components/common/Blur";
import ProtectedRoute from "../layouts/ProtectedRoute";

export default function Admin() {
  const [pages, setPages] = useState(0);
  const [ttlPages, setTtlPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const toast = useToast();
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(() => true);
    const { status, data, msg, redirect } = await getAllUsers(pages + 1);
    setPages((prev) => prev + 1);
    if (status && isArray(data)) {
      setUsers((prev) => [...prev, ...data] as User[]);
      if (data.length === 20) {
        setTtlPages((prev) => prev + 1);
      }
    } else {
      toast({
        status: "error",
        title: msg,
        isClosable: true,
        duration: 3000,
      });
      if (redirect) router.push(redirect);
    }
    setLoading(() => false);
  };

  const deleteUser = async (uid: string) => {
    const { status } = await deleteUserByUid(uid);
    if (status) {
      toast({
        status: "success",
        duration: 3000,
        title: "User deleted",
      });
      setUsers((prev) => {
        return prev.filter((o) => o.uid !== uid);
      });
    } else {
      toast({
        status: "error",
        duration: 3000,
        title: "Unable to delete User",
      });
    }
  };

  const addUser = async (uid: string) => {
    const { status, data } = await getUserByUid(uid);
    if (status) {
      setUsers((prev) => {
        return [data as User, ...prev];
      });
    } else {
      console.error(data);
    }
  };

  const liveUpdate = (data: Log) => {
    setLogs((prev: Log[]) => [data, ...prev]);
    if ([ACTIVITY_TYPE.REGISTER].includes(data.action)) {
      addUser(data.uid);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <ProtectedRoute>
      <Box pos="relative" px={{ base: 4, md: 8 }} pb={32} pt={16}>
        <VStack align="center" gap={4} pt={8} w="auto" mx="auto">
          <Center>
            <Icon as={ProfileCircle} boxSize={20} color="pink.600" />
          </Center>
          <Heading> Admin Panel </Heading>
          <Text>
            Manage all the user account and their sessions. Feels like
            superpower.
          </Text>
          <Show above="md">
            <UsersTable users={users} handleDelete={deleteUser} />
          </Show>
          <Show below="md">
            <UsersList users={users} handleDelete={deleteUser} />
          </Show>
          {ttlPages > pages && <Button isLoading={loading}> Load more </Button>}
          <Box w="100%">
            <VStack maxW="800px" gap={4} mx="auto">
              <LiveMonitoring room="admin" onEvent={liveUpdate} />
              <UserActivity
                isAdmin
                showUid
                logs={logs}
                setLogs={(data: Log[]) => {
                  setLogs((prev) => [...prev, ...data]);
                }}
              />
            </VStack>
          </Box>
        </VStack>
        <Blur
          position={"absolute"}
          top={-10}
          left={-10}
          style={{ filter: "blur(70px)" }}
        />
      </Box>
    </ProtectedRoute>
  );
}
