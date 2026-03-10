import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      
      {/* Logo */}
      <Pressable onPress={() => router.push("/home")}>
        <Text style={styles.logo}>🎟 Jota Events</Text>
      </Pressable>

      {/* Botão Login */}
      <Pressable
        style={styles.loginButton}
        onPress={() => router.push("/auth")}
      >
        <Text style={styles.loginText}>Entrar</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4f46e5",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
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