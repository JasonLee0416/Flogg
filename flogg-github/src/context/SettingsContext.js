import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const SettingsContext = createContext(null);
const KEY = '@flogg_settings';
const DEFAULTS = {
  lang: 'ko', darkMode: null, cameraMode: 'single',
  imageQuality: 'high', autoSave: true, aiProvider: 'gpt4o',
  autoAnalyze: false, haptic: true,
};

export function SettingsProvider({ children }) {
  const sys = useColorScheme();
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setSettings(prev => ({ ...prev, ...JSON.parse(raw) }));
      } catch (e) { console.warn('Settings load err:', e); }
      setLoaded(true);
    })();
  }, []);

  const update = async (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); }
    catch (e) { console.warn('Settings save err:', e); }
  };

  const isDark = settings.darkMode !== null ? settings.darkMode : sys === 'dark';

  return (
    <SettingsContext.Provider value={{ ...settings, isDark, update, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
