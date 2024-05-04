import {
  getColorFromAction,
  getMessageFromAction,
  parseDate,
} from "@/app/utils/helpers";
import { Log } from "@/app/utils/types";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Clock, Key, Profile } from "iconsax-react";
import { FaCircle } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

export const LogCard = ({
  showUid,
  log,
  onClick,
}: {
  showUid:boolean;
  log: Log;
  onClick: () => void;
}) => {

const iconColor = useColorModeValue("blue.600", "pink")

  return (
    <Card
      boxShadow="md"
      width="100%"
      onClick={onClick}
    >
      <CardHeader py={4}>
        <HStack gap={2} align="center">
        <Icon as={FaCircle} boxSize={4} color={getColorFromAction(log.action)} />
          <Icon as={MdSecurity} color={iconColor} boxSize={6} />
          <Text> {getMessageFromAction(log.action)} </Text>
        </HStack>
        <Divider borderTop="1px solid grey" mt={2} />
      </CardHeader>
      <CardBody pt={0}>
      {
        showUid && (
        <HStack gap={2} align="center">
          <Icon as={Profile} color={iconColor} boxSize={4} />
          <Text> UID: {log.uid.toUpperCase()}</Text>
        </HStack>
        )
      }
        <HStack gap={2} align="center">
          <Icon as={Key} color={iconColor} boxSize={4} />
          <Text> Device ID: {log.seed.toUpperCase()}</Text>
        </HStack>
        <HStack gap={2} align="center">
          <Icon as={Clock} color={iconColor} boxSize={4} />
          <Text> {parseDate(log.timestamp) || "Unknown"}</Text>
        </HStack>
      </CardBody>
    </Card>
  );
};
