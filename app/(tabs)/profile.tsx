import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import {
  getCurrentUser,
  signOut,
  updateUserProfile,
  getUserEvents,
  UserProfile,
} from '../services/appStorage';
import { useRouter } from 'expo-router';

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.replace('/auth');
        return;
      }

      setUser(currentUser);
      setProfile(currentUser);
      const events = await getUserEvents(currentUser.id);
      setUserEvents(events);
    };

    loadData();
  }, [router]);


  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      console.error('Erro ao sair:', error);
      Alert.alert('Erro', 'Não foi possível sair no momento.');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // setLoading(true);
    try {
      const updatedUser = await updateUserProfile({
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
      });
      setUser(updatedUser);
      setProfile(updatedUser);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      // setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
        
        <View style={styles.profileCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Pessoais</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.text 
              }]}
              value={profile.name}
              onChangeText={(value) => handleInputChange('name', value)}
              editable={isEditing}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.text + '80'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.text 
              }]}
              value={profile.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={isEditing}
              placeholder="seu@email.com"
              placeholderTextColor={colors.text + '80'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Telefone</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.text 
              }]}
              value={profile.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              editable={isEditing}
              placeholder="(11) 99999-9999"
              placeholderTextColor={colors.text + '80'}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: colors.background, 
                color: colors.text,
                borderColor: colors.text 
              }]}
              value={profile.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              editable={isEditing}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor={colors.text + '80'}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.editButton, { backgroundColor: colors.tint }]}
              onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Editar Perfil'}</Text>
            </Pressable>
            {isEditing && (
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  if (user) {
                    setProfile(user);
                  }
                }}
              >
                  <Text style={[styles.buttonText, { color: '#000' }]}>Cancelar</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.eventsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Meus Eventos Publicados</Text>
          {userEvents.length > 0 ? (
            <FlatList
              data={userEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={[styles.eventItem, { backgroundColor: colors.background }]}>
                  <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.eventDate, { color: colors.text + '80' }]}>{new Date(item.date).toLocaleDateString('pt-BR')} • {item.city}</Text>
                  <Text style={[styles.eventPrice, { color: colors.text }]}>{item.price ? `R$ ${item.price}` : 'Gratuito'}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text style={[styles.noEvents, { color: colors.text + '80' }]}>Nenhum evento publicado ainda.</Text>
          )}
        </View>

        <Pressable style={[styles.signOutButton, { backgroundColor: colors.tint }]} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sair</Text>
        </Pressable>
      </ScrollView>

      {/* Footer is provided globally by app/_layout.tsx */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  signOutButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for footer
  },
  eventsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
  },
  eventItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  noEvents: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 24 : 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerButton: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  footerButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});