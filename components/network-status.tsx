import { View, Text, StyleSheet } from "react-native";
import { useWiFiStatus } from "@/hooks/use-wifi-status";

export default function NetworkStatus() {
  const { network, loading } = useWiFiStatus();

  if (loading) {
    return null;
  }

  const getNetworkIcon = (type: string, isConnected: boolean) => {
    if (!isConnected) return "📡";
    if (type === "wifi") return "📶 WiFi";
    if (type === "cellular") return "📱 4G";
    return "📡 Online";
  };

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? "#059669" : "#ef4444";
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor(network.isConnected) }]}>
      <Text style={styles.text}>
        {getNetworkIcon(network.type, network.isConnected)}
      </Text>
      {network.ip && (
        <Text style={styles.ipText}>{network.ip}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  ipText: {
    color: "white",
    fontSize: 10,
    opacity: 0.8,
  },
});
