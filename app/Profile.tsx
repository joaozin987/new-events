import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)/profile');
  }, [router]);

  return null;
}