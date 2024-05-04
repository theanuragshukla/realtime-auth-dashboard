import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

import { User } from "@/app/utils/types";
import { useRouter } from "next/navigation";

export default function UsersTable({
  users,
  handleDelete,
}: {
  users: User[];
  handleDelete: (uid: string) => void;
}) {
  const router = useRouter();
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100")

  const handleClick = (uid: string) => {
    router.push(`/dashboard?forUid=${uid}`);
  };

  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }} variant="stripped">
        <Thead>
          <Tr>
            <Th> S. no </Th>
            <Th>UID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, idx) => (
            <Tr
              key={user.uid}
              _hover={{
                bg: hoverBg,
              }}
            >
              <Td>{idx + 1}</Td>
              <Td
                _hover={{
                  color: "blue.500",
                  textDecoration:"underline",
                  cursor:"pointer"
                }}
                onClick={() => handleClick(user.uid)}
              >
                {" "}
                {user.uid}
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>
                <IconButton
                  aria-label="Delete"
                  colorScheme="red"
                  variant="outline"
                  border="none"
                  icon={<MdDelete size={24} />}
                  onClick={() => handleDelete(user.uid)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
