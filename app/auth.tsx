import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = () => {
    console.log("Autenticando...");
    router.replace("/home");
  };

  const isFormValid = email && password && (isLogin || name);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
    

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🎟</Text>
            </View>
            <Text style={styles.logoText}>Jota Events</Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>
            {isLogin ? "Bem-vindo de volta 👋" : "Crie sua conta"}
          </Text>

          {/* Campo Nome */}
          {!isLogin && (
            <View style={styles.field}>
              <Text style={styles.label}>Nome completo</Text>

              <TextInput
                placeholder="Digite seu nome"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                value={name}
                onChangeText={setName}
                accessibilityLabel="Campo de nome completo"
              />
            </View>
          )}

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              placeholder="Digite seu e-mail"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Campo de email"
            />
          </View>

          {/* Senha */}
          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>

            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Campo de senha"
            />
          </View>

          {/* Botão principal */}
          <Pressable
            style={[
              styles.button,
              !isFormValid && { opacity: 0.5 }
            ]}
            onPress={handleAuth}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "Entrar" : "Criar conta"}
            </Text>
          </Pressable>

          {/* Alternar login/cadastro */}
          <Pressable onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Entrar"}
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  logoIcon: {
    fontSize: 30,
    color: "#fff",
  },

  logoText: {
    fontSize: 26,
    fontWeight: "bold",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  field: {
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "black",
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  switchText: {
    marginTop: 20,
    textAlign: "center",
    color: "#4f46e5",
    fontWeight: "500",
  },
});