import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useSegments } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/footer';

export default function RootLayout() {
  const segments = useSegments();
  const isAuthRoute = segments[0] === 'auth';
  const isTabsRoute = segments[0] === '(tabs)';

  return (
    <View style={styles.container}>
      {!isAuthRoute && <Header />}
      <View style={styles.slot}>
        <Slot />
      </View>
      {!isAuthRoute && !isTabsRoute && <Footer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slot: { flex: 1 },
});
