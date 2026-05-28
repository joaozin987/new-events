import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import NetworkStatus from "./network-status";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "../app/services/appStorage";

export default function Header() {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUserExists(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerInner}>
        {/* Logo */}
        <Pressable onPress={() => router.push("/(tabs)/home")}>
          <Text style={styles.logo}>🎟 Jota Events</Text>
        </Pressable>

        {/* Network Status e Botão Login/Perfil */}
        <View style={styles.rightContainer}>
          <NetworkStatus />
          {!userExists ? (
            <Pressable style={styles.loginButton} onPress={() => router.push("/auth")}> 
              <Text style={styles.loginText}>Entrar</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.loginButton} onPress={() => router.push("/(tabs)/profile")}>
              <Text style={styles.loginText}>Perfil</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4f46e5",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  loginButton: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  loginText: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});