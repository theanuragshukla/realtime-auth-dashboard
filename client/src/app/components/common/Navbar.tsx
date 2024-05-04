import {
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { Moon, ProfileCircle, Sun1 } from "iconsax-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const colorMode = useColorMode();
  const router = useRouter()
  return (
    <Flex boxShadow="md" p={4} justify="space-between">
      <HStack cursor="pointer" align="center" onClick={()=>router.push('/')}>
        <Icon as={ProfileCircle} boxSize={10} color="pink.600" />
        <Heading size="md" p={2}>
          Realtime Auth Dash
        </Heading>
      </HStack>
      <IconButton
        onClick={colorMode.toggleColorMode}
        icon={colorMode.colorMode === "light" ? <Moon /> : <Sun1 />}
        aria-label="color mode"
        colorScheme="pink"
      />
    </Flex>
  );
}
