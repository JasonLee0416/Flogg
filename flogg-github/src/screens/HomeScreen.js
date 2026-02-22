import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { useDatabase } from '../database/DatabaseContext';
import { Colors, S } from '../utils/theme';
import { i18n } from '../i18n/strings';

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

function typeIcon(text) {
  if (!text) return '🌸';
  if (text.includes('근조') || text.includes('조의')) return '🌺';
  if (text.includes('축하') || text.includes('결혼')) return '💐';
  if (text.includes('개업')) return '🌻';
  return '🌸';
}

export default function HomeScreen({ navigation }) {
  const { isDark, lang } = useSettings();
  const { receipts, refreshReceipts, isLoading } = useDatabase();
  const insets = useSafeAreaInsets();
  const c = isDark ? Colors.dark : Colors.light;
  const t = i18n[lang];

  useFocusEffect(useCallback(() => { refreshReceipts(); }, []));

  const todayItems = receipts.filter(r => isToday(r.created_at));
  const todayTotal = todayItems.length;

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
      </View>
      <Text style={[styles.rowTime, { color: c.tx3 }]}>
        {item.created_at ? new Date(item.created_at).toLocaleTimeString(lang === 'en' ? 'en' : 'ko', { hour: '2-digit', minute: '2-digit' }) : ''}
      </Text>
      <Text style={{ color: c.tx3, fontSize: 16, marginLeft: 4 }}>›</Text>
    </TouchableOpacity>
  );

  const separator = () => <View style={[styles.sep, { backgroundColor: c.sep }]} />;

  return (
    <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.largeTitle, { color: c.tx }]}>{t.title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: c.fill }]} onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: c.blue }]} onPress={() => navigation.navigate('Scan')}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.sep }]}>
        <Text style={[styles.cardLabel, { color: c.tx2 }]}>{t.todayTotal}</Text>
        <Text style={[styles.cardAmount, { color: c.tx }]}>{todayTotal}{lang === 'ko' ? '건' : ' records'}</Text>
        <View style={[styles.bar, { backgroundColor: c.fill }]}>
          <View style={[styles.barFill, { width: todayTotal > 0 ? `${Math.min(todayTotal * 20, 100)}%` : '0%', backgroundColor: c.blue }]} />
        </View>
      </View>

      <Text style={[styles.secTitle, { color: c.tx }]}>{t.today}</Text>

      {todayItems.length > 0 ? (
        <FlatList
          data={todayItems}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={separator}
          style={[styles.list, { backgroundColor: c.bg2, borderColor: c.sep }]}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshReceipts} tintColor={c.blue} />}
        />
      ) : (
        <View style={[styles.emptyBox, { backgroundColor: c.bg2, borderColor: c.sep }]}>
          <Text style={{ fontSize: 48, marginBottom: S.base, opacity: 0.5 }}>📄</Text>
          <Text style={[styles.emptyTitle, { color: c.tx }]}>{t.empty}</Text>
          <Text style={[styles.emptySub, { color: c.tx2 }]}>{t.emptyDesc}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.base, paddingBottom: S.md },
  largeTitle: { fontSize: 34, fontWeight: '700' },
  headerRight: { flexDirection: 'row', gap: S.sm, alignItems: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  addBtn: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  card: { marginHorizontal: S.base, marginBottom: S.xl, borderRadius: 16, padding: 20, borderWidth: 0.5 },
  cardLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: S.xs },
  cardAmount: { fontSize: 36, fontWeight: '800', marginBottom: S.base },
  bar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  secTitle: { fontSize: 17, fontWeight: '600', paddingHorizontal: S.lg, marginBottom: S.sm },
  list: { marginHorizontal: S.base, borderRadius: 16, borderWidth: 0.5, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.base, paddingVertical: S.md, minHeight: 60 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: S.md },
  rowContent: { flex: 1, marginRight: S.sm },
  rowTitle: { fontSize: 17, fontWeight: '500' },
  rowSub: { fontSize: 13, marginTop: 2 },
  rowTime: { fontSize: 11 },
  sep: { height: 0.5, marginLeft: 68 },
  emptyBox: { marginHorizontal: S.base, borderRadius: 16, padding: 48, alignItems: 'center', borderWidth: 0.5 },
  emptyTitle: { fontSize: 17, fontWeight: '600', marginBottom: S.xs },
  emptySub: { fontSize: 15, textAlign: 'center' },
});
