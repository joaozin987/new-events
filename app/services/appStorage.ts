import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'EVENTUS_USERS';
const CURRENT_USER_KEY = 'EVENTUS_CURRENT_USER';
const EVENTS_KEY = 'EVENTUS_EVENTS';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  bio?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  price: string;
  date: string;
  time: string;
  image: string;
  category: string;
  organizer: string;
  userId: string;
  gps?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
}

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getUsers = async (): Promise<LocalUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return parseJson<LocalUser[]>(raw, []);
};

export const saveUsers = async (users: LocalUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return parseJson<UserProfile | null>(raw, null);
};

export const setCurrentUser = async (user: UserProfile) => {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

// Ensure listeners are notified when user signs out
export const signOut = async () => {
  await clearCurrentUser();
  await notifyAuthListeners();
};

// Simple auth change subscription for UI updates
type AuthListener = (user: UserProfile | null) => void;
const authListeners: AuthListener[] = [];

export const notifyAuthListeners = async () => {
  const user = await getCurrentUser();
  authListeners.forEach((fn) => fn(user));
};

export const onAuthStateChanged = (listener: AuthListener) => {
  authListeners.push(listener);
  // fire immediately with current user
  (async () => {
    const user = await getCurrentUser();
    listener(user);
  })();

  return () => {
    const idx = authListeners.indexOf(listener);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
};

export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<UserProfile> => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  const existing = users.find((user) => user.email === normalizedEmail);

  if (existing) {
    const error = new Error('Este e-mail já está em uso.');
    (error as any).code = 'auth/email-already-in-use';
    throw error;
  }

  const newUser: LocalUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: '',
    bio: '',
  };

  users.push(newUser);
  await saveUsers(users);

  const profile: UserProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    bio: newUser.bio,
  };

  await setCurrentUser(profile);
  await notifyAuthListeners();
  return profile;
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserProfile> => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    (error as any).code = 'auth/user-not-found';
    throw error;
  }

  if (user.password !== password) {
    const error = new Error('Senha incorreta.');
    (error as any).code = 'auth/wrong-password';
    throw error;
  }

  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
  };

  await setCurrentUser(profile);
  await notifyAuthListeners();
  return profile;
};

export const updateUserProfile = async (
  updates: Partial<Omit<UserProfile, 'id' | 'email'>>
): Promise<UserProfile> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    const error = new Error('Usuário não autenticado.');
    (error as any).code = 'auth/user-not-authenticated';
    throw error;
  }

  const users = await getUsers();
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex === -1) {
    const error = new Error('Usuário não encontrado.');
    (error as any).code = 'auth/user-not-found';
    throw error;
  }

  users[userIndex] = {
    ...users[userIndex],
    name: updates.name ?? users[userIndex].name,
    phone: updates.phone ?? users[userIndex].phone,
    bio: updates.bio ?? users[userIndex].bio,
  };

  await saveUsers(users);

  const updatedProfile: UserProfile = {
    ...currentUser,
    name: updates.name ?? currentUser.name,
    phone: updates.phone ?? currentUser.phone,
    bio: updates.bio ?? currentUser.bio,
  };

  await setCurrentUser(updatedProfile);
  await notifyAuthListeners();
  return updatedProfile;
};

export const getEvents = async (): Promise<EventItem[]> => {
  const raw = await AsyncStorage.getItem(EVENTS_KEY);
  return parseJson<EventItem[]>(raw, []);
};

export const getUserEvents = async (userId: string): Promise<EventItem[]> => {
  const events = await getEvents();
  return events.filter((event) => event.userId === userId);
};

export const saveEvent = async (event: EventItem) => {
  const events = await getEvents();
  events.push(event);
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const deleteEventById = async (eventId: string) => {
  const events = await getEvents();
  const filtered = events.filter((event) => event.id !== eventId);
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
};

export const getEventById = async (eventId: string): Promise<EventItem | null> => {
  const events = await getEvents();
  return events.find((event) => event.id === eventId) ?? null;
};
