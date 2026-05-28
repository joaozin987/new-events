import { SafeAreaView, View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function Footer() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.footer}>
      
      <Pressable style={styles.item} onPress={() => router.push("/(tabs)/home")}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.text}>Início</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => router.push("/CreateEvent")}>
        <Text style={styles.icon}>➕</Text>
        <Text style={styles.text}>Criar</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={() => router.push("/(tabs)/profile")}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.text}>Perfil</Text>
      </Pressable>
       <Pressable style={styles.item} onPress={() => router.push("/(tabs)/myevents")}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.text}>Meus Eventos</Text>
      </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 64,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    // position fixed handled by SafeAreaView wrapper
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
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
    color: '#000',
  },
  safeArea: {
    backgroundColor: '#ffffff',
  },
});