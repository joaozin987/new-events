import { View, Text, StyleSheet, FlatList, Pressable, Image, TextInput, SafeAreaView } from "react-native";
import { useState, useMemo, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { mockEvents } from "../src/data/events";

import { Colors } from "@/constants/theme";

interface EventItem {
  id: string;
  title: string;
  city: string;
  category: string;
  image: string;
}

export default function Home() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event: any) => {
      const matchesSearch =
        !activeSearch ||
        event.title?.toLowerCase().includes(activeSearch.toLowerCase()) ||
        event.city?.toLowerCase().includes(activeSearch.toLowerCase());

      return matchesSearch;
    });
  }, [activeSearch]);

  const getGridTitle = () => {
    if (activeSearch)
      return `Resultados para "${activeSearch}"`;
    return "Próximos Eventos";
  };

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
    setActiveSearch(text);
  }, []);

  const renderEventCard = useCallback(({ item }: { item: EventItem }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/EventDetail?id=${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.eventCity}>{item.city}</Text>
        <Text style={styles.eventCategory}>{item.category}</Text>
      </View>
    </Pressable>
  ), [router]);

  const renderFooter = useCallback(() => (
    <View style={styles.footer}>
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Quer divulgar seu evento?</Text>
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push("/CreateEvent")}
        >
          <Text style={styles.ctaButtonText}>Criar Evento</Text>
        </Pressable>
      </View>
    </View>
  ), [router]);

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar style="dark" backgroundColor={Colors.light.background} />

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar eventos..."
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={<Text style={styles.sectionTitle}>{getGridTitle()}</Text>}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
          </View>
        }
        scrollEnabled={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
      />

      {/* Footer is now provided by app/_layout.tsx */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  container: {
    padding: 16,
    paddingBottom: 120,
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.light.background,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  cardContent: {
    padding: 12,
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: 0,
    resizeMode: 'cover',
  },

  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },

  eventCity: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 4,
  },

  eventCategory: {
    color: "#4f46e5",
    fontSize: 12,
    fontWeight: "600",
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  cta: {
    marginTop: 0,
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

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});