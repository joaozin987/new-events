import { useState, useEffect } from "react";
import * as Network from "expo-network";

export interface WiFiNetwork {
  connected: boolean;
  ssid?: string;
  ip?: string | null;
  type: "none" | "wifi" | "cellular" | "unknown";
  isConnected: boolean;
}

export function useWiFiStatus() {
  const [network, setNetwork] = useState<WiFiNetwork>({
    connected: false,
    type: "unknown",
    isConnected: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const ip = await Network.getIpAddressAsync();

      let ssid = undefined;
      if (state.type === "WIFI") {
        try {
          ssid = await Network.getNetworkStateAsync();
        } catch (error) {
          console.log("Could not get SSID");
        }
      }

      setNetwork({
        connected: state.isConnected ?? false,
        type: mapNetworkType(state.type),
        ip,
        isConnected: state.isConnected ?? false,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error checking network status:", error);
      setLoading(false);
    }
  };

  const mapNetworkType = (type: string): "none" | "wifi" | "cellular" | "unknown" => {
    switch (type) {
      case "WIFI":
        return "wifi";
      case "CELLULAR":
        return "cellular";
      case "NONE":
        return "none";
      default:
        return "unknown";
    }
  };

  return { network, loading, checkNetworkStatus };
}
