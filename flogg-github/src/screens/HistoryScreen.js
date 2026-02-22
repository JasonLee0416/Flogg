import React, { useCallback } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { useDatabase } from '../database/DatabaseContext';
import { Colors, S } from '../utils/theme';
import { i18n } from '../i18n/strings';

function dateLabel(dateStr, lang) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return lang === 'en' ? 'Today' : '오늘';
  const y = new Date(now); y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return lang === 'en' ? 'Yesterday' : '어제';
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', { month: 'long', day: 'numeric' });
}

function groupByDate(list, lang) {
  const map = {};
  list.forEach(r => {
    const label = dateLabel(r.created_at, lang);
    if (!map[label]) map[label] = [];
    map[label].push(r);
  });
  return Object.entries(map).map(([title, data]) => ({ title, data }));
}

function typeIcon(text) {
  if (!text) return '🌸';
  if (text.includes('근조') || text.includes('조의')) return '🌺';
  if (text.includes('축하') || text.includes('결혼')) return '💐';
  if (text.includes('개업')) return '🌻';
  return '🌸';
}

export default function HistoryScreen({ navigation }) {
  const { isDark, lang } = useSettings();
  const { receipts, refreshReceipts, isLoading } = useDatabase();
  const insets = useSafeAreaInsets();
  const c = isDark ? Colors.dark : Colors.light;
  const t = i18n[lang];

  useFocusEffect(useCallback(() => { refreshReceipts(); }, []));

  const sections = groupByDate(receipts, lang);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: c.bg2 }]}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    >
      <View style={[styles.iconBox, { backgroundColor: c.fill }]}>
        <Text style={{ fontSize: 20 }}>{typeIcon(item.product_detail)}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: c.tx }]} numberOfLines={1}>
          {item.orderer || t.unknown}
        </Text>
        <Text style={[styles.rowSub, { color: c.tx2 }]} numberOfLines={1}>
          {item.destination || ''}
        </Text>
        {item.ribbon_text ? (
          <Text style={[styles.rowRibbon, { color: c.tx3 }]} numberOfLines={1}>🎀 {item.ribbon_text}</Text>
        ) : null}
      </View>
      <Text style={[styles.rowTime, { color: c.tx3 }]}>
        {item.created_at ? new Date(item.created_at).toLocaleTimeString(lang === 'en' ? 'en' : 'ko', { hour: '2-digit', minute: '2-digit' }) : ''}
      </Text>
      <Text style={{ color: c.tx3, fontSize: 16, marginLeft: 4 }}>›</Text>
    </TouchableOpacity>
  );

  const renderHeader = ({ section }) => (
    <View style={[styles.secHeader, { backgroundColor: c.bg }]}>
      <Text style={[styles.secTitle, { color: c.tx }]}>{section.title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.largeTitle, { color: c.tx }]}>{t.allRecords}</Text>
        <Text style={[styles.count, { color: c.tx2 }]}>{t.totalCount.replace('{n}', receipts.length)}</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        renderSectionHeader={renderHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshReceipts} tintColor={c.blue} />}
        ListEmptyComponent={
          <View style={[styles.emptyBox, { backgroundColor: c.bg2, borderColor: c.sep }]}>
            <Text style={{ fontSize: 48, marginBottom: S.base, opacity: 0.5 }}>📋</Text>
            <Text style={[styles.emptyTitle, { color: c.tx }]}>{t.empty}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: S.base, paddingBottom: S.md },
  largeTitle: { fontSize: 34, fontWeight: '700' },
  count: { fontSize: 15, marginTop: 4 },
  secHeader: { paddingHorizontal: S.lg, paddingTop: S.base, paddingBottom: S.sm },
  secTitle: { fontSize: 17, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.base, paddingVertical: S.md, marginHorizontal: S.base, minHeight: 72, borderBottomWidth: 0.5, borderBottomColor: 'rgba(84,84,88,0.3)' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: S.md },
  rowContent: { flex: 1, marginRight: S.sm },
  rowTitle: { fontSize: 17, fontWeight: '500' },
  rowSub: { fontSize: 13, marginTop: 2 },
  rowRibbon: { fontSize: 11, marginTop: 2 },
  rowTime: { fontSize: 11 },
  emptyBox: { marginHorizontal: S.base, marginTop: S.xl, borderRadius: 16, padding: 48, alignItems: 'center', borderWidth: 0.5 },
  emptyTitle: { fontSize: 17, fontWeight: '600' },
});
