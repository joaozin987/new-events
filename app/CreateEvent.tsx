import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { requestPermissionsAsync as requestCameraPermissionsAsync } from "expo-camera";
import DateTimePicker from "@react-native-community/datetimepicker";
// Header is provided by app/_layout.tsx
import { getCurrentUser, saveEvent, UserProfile } from "./services/appStorage";

interface EventLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

export default function CreateEvent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [eventLocation, setEventLocation] = useState<EventLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/auth');
        return;
      }
      setCurrentUser(user);
      await requestPermissions();
    };

    initialize();
  }, [router]);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      
      if (cameraStatus.status !== "granted") {
        console.log("Permissão de câmera negada");
      }
      if (locationStatus.status !== "granted") {
        console.log("Permissão de localização negada");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissões:", error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão", "Precisamos de acesso à câmera");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      Alert.alert("Erro", "Erro ao capturar foto");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Erro ao selecionar imagem");
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão", "Precisamos de acesso à localização");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      
      // Try to get city name from coordinates
      let cityName = "";
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (addresses && addresses.length > 0) {
          cityName = addresses[0].city || "";
        }
      } catch (error) {
        console.log("Erro ao fazer reverse geocoding:", error);
      }

      setEventLocation({ latitude, longitude, city: cityName });
      if (cityName) {
        setCity(cityName);
      }
      Alert.alert(
        "Localização",
        `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\nCidade: ${cityName || "Detectar automáticamente"}`
      );
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      Alert.alert("Erro", "Erro ao obter localização GPS");
    } finally {
      setLoadingLocation(false);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const isFormValid = title && description && location && city && price && image;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos");
      return;
    }

    const eventData = {
      id: Date.now().toString(),
      title,
      description,
      location,
      city,
      price,
      date: date.toISOString(),
      image,
      gps: eventLocation,
      createdAt: new Date().toISOString(),
      category: "Evento", // default category
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      organizer: "Você", // or get from user profile
    };

    try {
      const eventPayload = {
        ...eventData,
        organizer: currentUser?.name || 'Você',
        userId: currentUser?.id ?? '',
      };

      await saveEvent(eventPayload);

      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      router.replace('/(tabs)/myevents');
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      Alert.alert('Erro', 'Erro ao salvar evento');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header provided by root layout */}

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.form}>
          <Text style={styles.title}>Criar Evento</Text>

          {/* Nome */}
          <Text style={styles.label}>Nome do Evento</Text>
          <TextInput
            placeholder="Título do evento"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />

          {/* Imagem */}
          <Text style={styles.label}>Imagem do Evento</Text>
          <View style={styles.imageButtonsContainer}>
            <Pressable style={[styles.buttonSecondary, { flex: 1, marginRight: 8 }]} onPress={takePhoto}>
              <Text style={styles.buttonSecondaryText}>📷 Câmera</Text>
            </Pressable>
            <Pressable style={[styles.buttonSecondary, { flex: 1 }]} onPress={pickImage}>
              <Text style={styles.buttonSecondaryText}>🖼️ Galeria</Text>
            </Pressable>
          </View>

          {image && (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          )}

          {/* Descrição */}
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            placeholder="Descrição do evento"
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor="#9ca3af"
          />

          {/* Local */}
          <Text style={styles.label}>Local do Evento</Text>
          <TextInput
            placeholder="Local"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#9ca3af"
          />

          {/* Cidade */}
          <Text style={styles.label}>Cidade</Text>
          <View style={styles.cityContainer}>
            <TextInput
              placeholder="Cidade"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={city}
              onChangeText={setCity}
              placeholderTextColor="#9ca3af"
            />
            <Pressable 
              style={[styles.buttonSecondary, { paddingHorizontal: 12, justifyContent: "center" }]} 
              onPress={getCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#4f46e5" />
              ) : (
                <Text style={styles.buttonSecondaryText}>📍 GPS</Text>
              )}
            </Pressable>
          </View>

          {eventLocation && (
            <Text style={styles.locationInfo}>
              ✓ GPS: {eventLocation.latitude.toFixed(4)}, {eventLocation.longitude.toFixed(4)}
            </Text>
          )}

          {/* Preço */}
          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            placeholder="Preço"
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor="#9ca3af"
          />

          {/* Data */}
          <Text style={styles.label}>Data do Evento</Text>
          <Pressable
            style={styles.dateInput}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              📅 {date.toLocaleDateString("pt-BR")}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}

          {/* Botões */}
          <Pressable
            style={[styles.buttonPrimary, !isFormValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>🚀 Publicar Evento</Text>
          </Pressable>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Footer is provided globally by app/_layout.tsx */}
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    padding: 20,
    paddingBottom: 120, 
  },

  form: {
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    padding: 25,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4f46e5",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1f2937",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9fafb",
    fontSize: 16,
    color: "#1f2937",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9fafb",
    marginBottom: 15,
  },

  dateText: {
    fontSize: 16,
    color: "#1f2937",
  },

  imageButtonsContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
  },

  cityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  buttonPrimary: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },

  buttonDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.6,
  },

  buttonSecondary: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonSecondaryText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },

  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 8,
  },

  locationInfo: {
    fontSize: 13,
    color: "#059669",
    marginBottom: 15,
    fontWeight: "500",
  },
});