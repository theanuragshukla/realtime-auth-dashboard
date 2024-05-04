import { User } from "@/app/utils/types";
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

export default function UsersList({
  users,
  handleDelete,
}: {
  users: User[];
  handleDelete: (uid: string) => void;
}) {
  const router = useRouter();

  const handleClick = (uid: string) => {
    router.push(`/dashboard?forUid=${uid}`);
  };
  return (
    <VStack spacing={4} w="100%" px={{ base: 2, sm: 4, md: 8 }}>
      {users.map((user, idx) => (
        <Card px={4} py={0} w="100%">
          <CardHeader p={0}>
            <HStack gap={4} justify="space-between">
              <Heading
                fontSize={18}
                onClick={() => handleClick(user.uid)}
                _hover={{
                  color: "blue.500",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {idx + 1}. {user.name}
              </Heading>
              <IconButton
                aria-label="Delete"
                colorScheme="red"
                variant="outline"
                border="none"
                icon={<MdDelete size={24} />}
                onClick={() => handleDelete(user.uid)}
              />
            </HStack>
          </CardHeader>
          <CardBody p={0}>
            <VStack w="100%" align="start">
              <Text> Email: {user.email} </Text>
              <Text> Role: {user.role} </Text>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}
