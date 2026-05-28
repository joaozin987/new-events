import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, StatusBar, Pressable, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { getCurrentUser, getUserEvents, deleteEventById } from '../services/appStorage';

interface EventItem {
  id: string;
  title: string;
  city: string;
  category: string;
  image: string;
  description: string;
  location: string;
  price: string;
  date: string;
  time: string;
  organizer: string;
}

export default function MyEvents() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.replace('/auth');
        return;
      }

      const userEvents = await getUserEvents(currentUser.id);
      setEvents(userEvents);
    };

    loadEvents();
  }, [router]);

  const deleteEvent = async (eventId: string) => {
    Alert.alert(
      'Excluir Evento',
      'Tem certeza que deseja excluir este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEventById(eventId);
              setEvents((current) => current.filter((event) => event.id !== eventId));
            } catch (error) {
              console.error('Erro ao excluir evento:', error);
            }
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }: { item: EventItem }) => (
    <View style={[styles.eventCard, { backgroundColor: colors.card }]}>
      <Pressable
        style={styles.eventContent}
        onPress={() => router.push(`/EventDetail?id=${item.id}`)}
        onLongPress={() => deleteEvent(item.id)}
      >
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.eventCity, { color: colors.text }]}>
            {item.city} • {item.category}
          </Text>
          <Text style={[styles.eventDate, { color: colors.text }]}>
            📅 {new Date(item.date).toLocaleDateString('pt-BR')} • ⏰ {item.time}
          </Text>
          <Text style={[styles.eventPrice, { color: colors.tint }]}>
            {item.price ? `R$ ${item.price}` : "Gratuito"}
          </Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Meus Eventos</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Eventos que você criou
        </Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Você ainda não criou nenhum evento.
          </Text>
          <Pressable
            style={[styles.createButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/CreateEvent')}
          >
            <Text style={styles.createButtonText}>Criar Primeiro Evento</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  list: {
    padding: 20,
  },
  eventCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventContent: {
    flexDirection: 'row',
    padding: 12,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
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
  eventDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});