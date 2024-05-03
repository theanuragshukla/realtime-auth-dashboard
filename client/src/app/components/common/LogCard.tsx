"use client";
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
} from "@chakra-ui/react";
import { Clock, Key } from "iconsax-react";
import { MdSecurity } from "react-icons/md";

export const LogCard = ({
  log,
  onClick,
}: {
  log: Log;
  onClick: () => void;
}) => {
  return (
    <Card
      boxShadow="md"
      width="100%"
      bg={getColorFromAction(log.action)}
      onClick={onClick}
    >
      <CardHeader py={4}>
        <HStack gap={2} align="center">
          <Icon as={MdSecurity} color="blue.500" boxSize={6} />
          <Text> {getMessageFromAction(log.action)} </Text>
        </HStack>
        <Divider borderTop="1px solid grey" mt={2} />
      </CardHeader>
      <CardBody pt={0}>
        <HStack gap={2} align="center">
          <Icon as={Key} color="blue" boxSize={4} />
          <Text> Device ID: {log.seed.toUpperCase()}</Text>
        </HStack>
        <HStack gap={2} align="center">
          <Icon as={Clock} color="blue" boxSize={4} />
          <Text> {parseDate(log.timestamp) || "Unknown"}</Text>
        </HStack>
      </CardBody>
    </Card>
  );
};
