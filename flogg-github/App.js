import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { DatabaseProvider } from './src/database/DatabaseContext';
import { Colors } from './src/utils/theme';
import { i18n } from './src/i18n/strings';

import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import DetailScreen from './src/screens/DetailScreen';
import SettingsSheet from './src/screens/SettingsSheet';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, color }) {
  return <Text style={{ fontSize: 22, color }}>{emoji}</Text>;
}

function Tabs() {
  const { isDark, lang } = useSettings();
  const c = isDark ? Colors.dark : Colors.light;
  const t = i18n[lang];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: c.bar, borderTopColor: c.sep, borderTopWidth: 0.5 },
        tabBarActiveTintColor: c.blue,
        tabBarInactiveTintColor: c.tx3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: t.tabHome, tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }} />
      <Tab.Screen name="Scan" component={ScanScreen}
        options={{ tabBarLabel: t.tabScan, tabBarIcon: ({ color }) => <TabIcon emoji="📷" color={color} /> }} />
      <Tab.Screen name="History" component={HistoryScreen}
        options={{ tabBarLabel: t.tabHistory, tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} /> }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { isDark } = useSettings();
  const theme = isDark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: '#000' } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#F2F2F7' } };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ presentation: 'card' }} />
        <Stack.Screen name="Settings" component={SettingsSheet} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <DatabaseProvider>
          <Root />
        </DatabaseProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
