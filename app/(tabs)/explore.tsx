import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, StatusBar, TextInput, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { mockEvents } from '@/src/data/events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Explore() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [allEvents, setAllEvents] = useState<typeof mockEvents>([]);
  const [filteredEvents, setFilteredEvents] = useState<typeof mockEvents>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const filterEvents = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(allEvents);
    } else {
      const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [allEvents, searchQuery]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('userEvents');
      const userEvents = storedEvents ? JSON.parse(storedEvents) : [];
      const combinedEvents = [...mockEvents, ...userEvents];
      setAllEvents(combinedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setAllEvents(mockEvents);
    }
  };

  

  const renderEvent = ({ item }: { item: typeof mockEvents[0] }) => (
    <Pressable
      style={[styles.eventCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/EventDetail?id=${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.eventCity, { color: colors.text }]}>{item.city}</Text>
        <Text style={[styles.eventCategory, { color: colors.tint }]}>{item.category}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explorar Eventos</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Descubra eventos incríveis próximos a você
        </Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.text }]}
          placeholder="Buscar eventos..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  list: {
    padding: 20,
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  eventInfo: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventCity: {
    fontSize: 14,
    marginBottom: 2,
  },
  eventCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
});
