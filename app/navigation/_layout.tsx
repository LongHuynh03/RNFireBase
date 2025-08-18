import React from 'react';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Trang chủ' }} />
        <Stack.Screen name="functions" options={{ title: 'Functions' }} />
        <Stack.Screen name="in-app-messaging" options={{ title: 'In-App Messaging' }} />
        <Stack.Screen name="installations" options={{ title: 'Installations' }} />
        <Stack.Screen name="messaging" options={{ title: 'Messaging' }} />
        <Stack.Screen name="ml" options={{ title: 'Machine Learning' }} />
        <Stack.Screen name="perf" options={{ title: 'Performance Monitoring' }} />
        <Stack.Screen name="remote-config" options={{ title: 'Remote Config' }} />
        <Stack.Screen name="storage" options={{ title: 'Storage' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
