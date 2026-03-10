import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "@/components/Header";
import Footer from "@/components/footer";

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const handleSubmit = () => {
    console.log("Evento criado:", {
      title,
      description,
      location,
      city,
      price,
      date,
      image,
    });

    router.replace("/EventDetail");
  };

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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
          />

          {/* Imagem */}
          <Text style={styles.label}>Imagem do Evento</Text>
          <Pressable style={styles.buttonPrimary} onPress={pickImage}>
            <Text style={styles.buttonText}>Selecionar Imagem</Text>
          </Pressable>

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
          />

          {/* Local */}
          <Text style={styles.label}>Local do Evento</Text>
          <TextInput
            placeholder="Local"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
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
          <Pressable style={styles.buttonPrimary} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Publicar Evento</Text>
          </Pressable>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.buttonSecondaryText}>
              Voltar para Página Inicial
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Footer />
    </View>
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
    color: "#20539D",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#000",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#f9fafb",
    fontSize: 16,
  },

  textArea: {
    height: 100,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#f9fafb",
    marginBottom: 15,
  },

  dateText: {
    fontSize: 16,
    color: "#000",
  },

  buttonPrimary: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },

  buttonSecondary: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#20539D",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonSecondaryText: {
    color: "#20539D",
    fontWeight: "bold",
    fontSize: 16,
  },

  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 10,
  },
});