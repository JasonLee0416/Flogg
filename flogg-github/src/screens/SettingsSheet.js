import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { useDatabase } from '../database/DatabaseContext';
import { Colors, S } from '../utils/theme';
import { i18n } from '../i18n/strings';

export default function SettingsSheet({ navigation }) {
  const s = useSettings();
  const { clearAll } = useDatabase();
  const { isDark, lang, update } = s;
  const insets = useSafeAreaInsets();
  const c = isDark ? Colors.dark : Colors.light;
  const t = i18n[lang];

  const handleReset = () => {
    Alert.alert(t.reset, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      { text: t.reset, style: 'destructive', onPress: () => clearAll() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <View style={{ width: 60 }} />
        <Text style={[styles.navTitle, { color: c.tx }]}>{t.settings}</Text>
        <TouchableOpacity style={{ width: 60, alignItems: 'flex-end' }} onPress={() => navigation.goBack()}>
          <Text style={[styles.navDone, { color: c.blue }]}>{t.done}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Sec title={t.secLang} c={c}>
          <SegRow icon="🌐" label={t.lang} c={c}
            opts={[['ko', t.ko], ['en', t.en]]} val={lang} set={v => update('lang', v)} />
        </Sec>

        <Sec title={t.secDisplay} c={c}>
          <TogRow icon="🌙" label={t.dark} desc={t.darkDesc} c={c}
            val={isDark} set={v => update('darkMode', v)} />
        </Sec>

        <Sec title={t.secCamera} c={c}>
          <SegRow icon="📷" label={t.shoot} c={c}
            opts={[['single', t.single], ['batch', t.batch]]} val={s.cameraMode} set={v => update('cameraMode', v)} />
          <Sep c={c} />
          <SegRow icon="🖼️" label={t.quality} c={c}
            opts={[['low', t.low], ['high', t.high]]} val={s.imageQuality} set={v => update('imageQuality', v)} />
          <Sep c={c} />
          <TogRow icon="💾" label={t.save} desc={t.saveDesc} c={c}
            val={s.autoSave} set={v => update('autoSave', v)} />
        </Sec>

        <Sec title={t.secAI} c={c}>
          <SegRow icon="🤖" label={t.engine} c={c}
            opts={[['gpt4o', 'GPT-4o'], ['gemini', 'Gemini']]} val={s.aiProvider} set={v => update('aiProvider', v)} />
          <Sep c={c} />
          <TogRow icon="⚡" label={t.autoAnalyze} desc={t.autoAnalyzeDesc} c={c}
            val={s.autoAnalyze} set={v => update('autoAnalyze', v)} />
        </Sec>

        <Sec title={t.secGen} c={c}>
          <TogRow icon="📳" label={t.haptic} desc={t.hapticDesc} c={c}
            val={s.haptic} set={v => update('haptic', v)} />
          <Sep c={c} />
          <NavRow icon="📊" label={t.exp} detail="CSV, Excel" c={c} />
          <Sep c={c} />
          <NavRow icon="🗑️" label={t.reset} c={c} destructive onPress={handleReset} />
        </Sec>

        <Sec title={t.secInfo} c={c}>
          <InfoRow label={t.ver} value="1.0.0" c={c} />
          <Sep c={c} />
          <InfoRow label={t.api} value={t.conn} c={c} vc={c.green} />
        </Sec>
      </ScrollView>
    </View>
  );
}

function Sec({ title, c, children }) {
  return (
    <View style={{ marginBottom: S.xl }}>
      <Text style={[st.secTitle, { color: c.tx2 }]}>{title}</Text>
      <View style={[st.secCard, { backgroundColor: c.bg2, borderColor: c.sep }]}>{children}</View>
    </View>
  );
}

function Sep({ c }) { return <View style={[st.sep, { backgroundColor: c.sep }]} />; }

function TogRow({ icon, label, desc, c, val, set }) {
  return (
    <View style={st.row}>
      <Text style={st.ico}>{icon}</Text>
      <View style={st.rowFlex}>
        <Text style={[st.rowLabel, { color: c.tx }]}>{label}</Text>
        {desc ? <Text style={[st.rowDesc, { color: c.tx2 }]}>{desc}</Text> : null}
      </View>
      <Switch value={val} onValueChange={set} trackColor={{ false: c.togOff, true: c.green }} thumbColor="#fff" />
    </View>
  );
}

function SegRow({ icon, label, c, opts, val, set }) {
  return (
    <View style={st.row}>
      <Text style={st.ico}>{icon}</Text>
      <View style={{ flex: 1, marginRight: S.md }}>
        <Text style={[st.rowLabel, { color: c.tx }]}>{label}</Text>
      </View>
      <View style={[st.seg, { backgroundColor: c.segBg }]}>
        {opts.map(([k, l]) => {
          const a = val === k;
          return (
            <TouchableOpacity key={k} style={[st.segBtn, a && [st.segOn, { backgroundColor: c.segOn }]]} onPress={() => set(k)}>
              <Text style={[st.segTxt, { color: a ? c.tx : c.tx2, fontWeight: a ? '600' : '400' }]}>{l}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function NavRow({ icon, label, detail, c, destructive, onPress }) {
  return (
    <TouchableOpacity style={st.row} activeOpacity={0.6} onPress={onPress}>
      <Text style={st.ico}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[st.rowLabel, { color: destructive ? c.red : c.tx }]}>{label}</Text>
      </View>
      {detail ? <Text style={[st.rowLabel, { color: c.tx2, marginRight: S.xs }]}>{detail}</Text> : null}
      <Text style={{ color: c.tx3, fontSize: 16 }}>›</Text>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value, c, vc }) {
  return (
    <View style={st.row}>
      <View style={{ flex: 1 }}><Text style={[st.rowLabel, { color: c.tx }]}>{label}</Text></View>
      <Text style={[st.rowLabel, { color: vc || c.tx2 }]}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  secTitle: { fontSize: 13, textTransform: 'uppercase', paddingHorizontal: S.xxl, marginBottom: 6 },
  secCard: { marginHorizontal: S.base, borderRadius: 12, overflow: 'hidden', borderWidth: 0.5 },
  sep: { height: 0.5, marginLeft: 54 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.base, paddingVertical: S.md, minHeight: 44 },
  ico: { fontSize: 18, width: 26, textAlign: 'center', marginRight: S.md },
  rowFlex: { flex: 1, marginRight: S.sm },
  rowLabel: { fontSize: 17 },
  rowDesc: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  seg: { flexDirection: 'row', borderRadius: 8, padding: 2 },
  segBtn: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 6 },
  segOn: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 2 },
  segTxt: { fontSize: 13 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.base, paddingVertical: S.md },
  navTitle: { fontSize: 17, fontWeight: '600' },
  navDone: { fontSize: 17, fontWeight: '600' },
});
