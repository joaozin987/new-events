import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { createUser, loginUser, getCurrentUser } from "./services/appStorage";

export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace("/(tabs)/home");
      }
    };

    checkAuth();
  }, [router]);

  const getAuthErrorMessage = (error: any) => {
    if (!error) return "Não foi possível autenticar.";

    const code = error.code ?? error?.nativeError?.code;
    switch (code) {
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso.";
      case "auth/user-not-found":
        return "Usuário não encontrado.";
      case "auth/wrong-password":
        return "Senha incorreta.";
      case "auth/invalid-email":
        return "Digite um e-mail válido.";
      case "auth/weak-password":
        return "A senha precisa ter pelo menos 6 caracteres.";
      default:
        return error.message || "Não foi possível autenticar.";
    }
  };

  const handleAuth = async () => {
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser({ email, password });
      } else {
        await createUser({ email, password, name });
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Erro de autenticação", getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && (isLogin || name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
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
              (!isFormValid || loading) && { opacity: 0.5 }
            ]}
            onPress={handleAuth}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? "Entrar" : "Criar conta"}
              </Text>
            )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

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
    color: "#000",
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