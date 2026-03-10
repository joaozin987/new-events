import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Footer() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      
      <Pressable style={styles.item} onPress={() => router.push("/home")}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.text}>Inicio</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => router.push("/CreateEvent")}>
        <Text style={styles.icon}>➕</Text>
        <Text style={styles.text}>Criar</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => router.push("/Profile")}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.text}>Perfil</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  item: {
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  text: {
    fontSize: 12,
    marginTop: 2,
  },
});