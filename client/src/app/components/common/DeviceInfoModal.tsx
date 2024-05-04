import { camelToTitle, parseDate, pick } from "@/app/utils/helpers";
import { DeviceDetails, Log } from "@/app/utils/types";
import { getDeviceDetail } from "@/data/managers/account";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowRight3, Clock, Flash } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeviceInfoModal({
  log,
  isOpen,
  onClose,
}: {
  log?: Log;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<DeviceDetails>();
  const searchParams = useSearchParams();
  const forUid = searchParams.get("forUid") || "";

  const fetchDeviceData = async () => {
    if(!log)return 
    const { status, data, msg } = await getDeviceDetail({
      id: log.seed,
      uid: forUid || log.uid,
    });
    if (status) {
      setData(data as DeviceDetails);
    } else {
      console.log(msg);
    }
  };

  useEffect(() => {
    if (!!log?.seed) fetchDeviceData();
  }, [log]);

  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={{ base: "full", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Device Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            <VStack align="start" spacing={2}>
              {
                <>
                  <HStack gap={2} align="center" wrap="wrap" overflow="hidden">
                    <Icon as={Flash} color="blue" boxSize={4} />
                    <Text>Status: {data?.status ? "Active" : "Inactive"}</Text>
                  </HStack>
                  <HStack gap={2} align="center" wrap="wrap" overflow="hidden">
                    <Icon as={Clock} color="blue" boxSize={4} />
                    <Text>
                      Last active: {parseDate(data?.last_active) || "Unknown"}
                    </Text>
                  </HStack>
                  {...Object.entries(
                    pick(data?.device_details, [
                      "browser",
                      "browserVersion",
                      "deviceModel",
                      "deviceBrand",
                      "deviceFamily",
                      "os",
                      "osVersion",
                      "ipAddress",
                      "cityLatLang",
                      "countryName",
                      "countryCode",
                      "region",
                      "city",
                      "device",
                    ])
                  ).map(([key, value]) => {
                    return (
                      <HStack
                        key={key}
                        gap={2}
                        align="center"
                        wrap="wrap"
                        overflow="hidden"
                      >
                        <Icon as={ArrowRight3} color="blue" boxSize={4} />
                        <Text>
                          {camelToTitle(key)}: {value}
                        </Text>
                      </HStack>
                    );
                  })}
                </>
              }
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
