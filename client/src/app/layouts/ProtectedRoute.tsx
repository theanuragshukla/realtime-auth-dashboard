"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@chakra-ui/react";
import { getprofile } from "@/data/managers/auth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { status } = await getprofile();
        setAuthStatus(status);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading && !authStatus) {
    return <Progress w="100%" isIndeterminate h={1} />;
  }

  if (!loading && authStatus) {
    return children;
  }

  router.push("/login");
  return null;
};

export default ProtectedRoute;
