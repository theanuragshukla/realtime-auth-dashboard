import { parseDate, reduceIpv6 } from "@/app/utils/helpers";
import { DeviceDetails } from "@/app/utils/types";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  HStack, 
  Icon, 
  Heading, 
  Text, 
  Button, 
  Divider, 
  Spacer 
  } from "@chakra-ui/react";
import { Clock, Hashtag, InfoCircle, Key, Location, Mobile } from "iconsax-react";

export const DeviceCard = ({
  device,
  onSignOut,
  onClick,
}: {
  device: DeviceDetails;
  onSignOut: ()=>void;
  onClick: ()=>void;
}) => {
  const { device_details } = device;
  const device_name = `${device_details.browser || ""} ${
    device_details.os || ""
  }`;
  return (
    <Card size="md" boxShadow="md">
      <CardHeader py={4}>
        <HStack justify="space-between" gap={4} align="center">
          <Icon as={Mobile} boxSize={6} color="blue.500" />
          <Heading size="md">
            {device_name.trim().length ? device_name : "Unknown device"}
          </Heading>
          <Spacer width={8} />
          <Button
            variant="outline"
            size="xs"
            colorScheme={
              device.isCurrent ? "blue" : device.status ? "red" : "grey"
            }
            isDisabled={device.isCurrent || !device.status}
            onClick={onSignOut}
          >
            {device.isCurrent
              ? "Current"
              : device.status
                ? "Sign out"
                : "Signed out"}
          </Button>
        </HStack>
        <Divider borderTop="1px solid grey" mt={2} />
      </CardHeader>
      <CardBody pt={4} pb={8}>
        <HStack gap={2} align="center" wrap="wrap">
          <Icon as={Key} color="blue" boxSize={4} />
          <Text overflow="hidden" wordBreak="break-all">
            Device ID: {device.seed.toUpperCase() || "Unknown"}
          </Text>
          <Icon as={InfoCircle} boxSize={4} color="blue" onClick={onClick} />
        </HStack>
        <HStack gap={2} align="center" wrap="wrap">
          <Icon as={Hashtag} color="blue" boxSize={4} />
          <Text overflow="hidden" wordBreak="break-all">
            IP: {reduceIpv6(device_details.ipAddress || "Unknown")}
          </Text>
        </HStack>
        <HStack gap={2} align="center" wrap="wrap" overflow="hidden">
          <Icon as={Clock} color="blue" boxSize={4} />
          <Text>Last active: {parseDate(device.last_active) || "Unknown"}</Text>
        </HStack>
        <HStack gap={2} align="center">
          <Icon as={Location} color="blue" boxSize={4} />
          <Text>
            {" "}
            Location:{" "}
            {device_details.city ||
              device_details.cityLatLong ||
              device_details.region ||
              device_details.countryName ||
              "Unknown"}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
};
