import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { mockEvents } from "../src/data/events";

import Header from "../components/Header";
import Footer from "@/components/footer";

export default function Home() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        !activeSearch ||
        event.title?.toLowerCase().includes(activeSearch.toLowerCase()) ||
        event.city?.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesCategory =
        !activeCategory || event.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeSearch, activeCategory]);

  const getGridTitle = () => {
    if (activeSearch && activeCategory)
      return `Resultados para "${activeSearch}"`;
    if (activeSearch)
      return `Resultados para "${activeSearch}"`;
    if (activeCategory)
      return `Eventos de ${activeCategory}`;
    return "Próximos Eventos";
  };

  return (
    <View style={styles.page}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Título */}
        <Text style={styles.sectionTitle}>{getGridTitle()}</Text>

        {/* Lista de Eventos */}
        {filteredEvents.map((event) => (
          <Pressable
            key={event.id}
            style={styles.card}
            onPress={() => router.push(`/EventDetail?id=${event.id}`)}
          >
            <Image source={{ uri: event.image }} style={styles.image} />

            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventCity}>{event.city}</Text>
          </Pressable>
        ))}

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Quer divulgar seu evento?</Text>

          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push("/CreateEvent")}
          >
            <Text style={styles.ctaButtonText}>Criar Evento</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },

  container: {
    padding: 16,
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3 ,
    shadowRadius: 4,
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },

  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  eventCity: {
    color: "#6b7280",
    marginTop: 2,
  },

  cta: {
    marginTop: 20,
    padding: 24,
    backgroundColor: "#4f46e5",
    borderRadius: 16,
    alignItems: "center",
  },

  ctaTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },

  ctaButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },

  ctaButtonText: {
    fontWeight: "bold",
    color: "#4f46e5",
  },
});