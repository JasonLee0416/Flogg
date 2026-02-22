import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { useDatabase } from '../database/DatabaseContext';
import { Colors, S } from '../utils/theme';
import { i18n } from '../i18n/strings';
import { getReceiptById } from '../database/db';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { isDark, lang } = useSettings();
  const { editReceipt, removeReceipt } = useDatabase();
  const insets = useSafeAreaInsets();
  const c = isDark ? Colors.dark : Colors.light;
  const t = i18n[lang];

  const [receipt, setReceipt] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      const data = await getReceiptById(id);
      if (data) {
        setReceipt(data);
        setForm({
          destination: data.destination || '',
          orderer: data.orderer || '',
          productDetail: data.product_detail || '',
          ribbonText: data.ribbon_text || '',
          memo: data.memo || '',
        });
      }
    })();
  }, [id]);

  const handleSave = async () => {
    await editReceipt(id, form);
    setEditing(false);
    const data = await getReceiptById(id);
    setReceipt(data);
  };

  const handleDelete = () => {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: async () => { await removeReceipt(id); navigation.goBack(); } },
    ]);
  };

  if (!receipt) return <View style={[styles.container, { backgroundColor: c.bg }]} />;

  const Field = ({ label, field, multiline }) => (
    <View style={[styles.field, { borderBottomColor: c.sep }]}>
      <Text style={[styles.fieldLabel, { color: c.tx2 }]}>{label}</Text>
      {editing ? (
        <TextInput
          style={[styles.input, { color: c.tx, borderColor: c.sep }]}
          value={form[field]}
          onChangeText={v => setForm(prev => ({ ...prev, [field]: v }))}
          multiline={multiline}
          placeholderTextColor={c.tx3}
        />
      ) : (
        <Text style={[styles.fieldVal, { color: c.tx }]}>{form[field] || '-'}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color: c.blue, fontSize: 22 }}>‹</Text>
            <Text style={[styles.backTxt, { color: c.blue }]}>{t.back}</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            {editing ? (
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.actTxt, { color: c.blue }]}>{t.done}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={() => setEditing(true)}>
                  <Text style={[styles.actTxt, { color: c.blue }]}>{t.edit}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete}>
                  <Text style={{ fontSize: 20 }}>🗑️</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {receipt.image_uri ? (
            <Image source={{ uri: receipt.image_uri }} style={styles.image} resizeMode="contain" />
          ) : null}

          <View style={[styles.group, { backgroundColor: c.bg2, borderColor: c.sep }]}>
            <Field label={t.destination} field="destination" />
            <Field label={t.orderer} field="orderer" />
            <Field label={t.product} field="productDetail" />
            <Field label={t.ribbon} field="ribbonText" />
            <Field label={t.memo} field="memo" multiline />
          </View>

          <Text style={[styles.ts, { color: c.tx3 }]}>
            {receipt.created_at ? new Date(receipt.created_at).toLocaleString(lang === 'en' ? 'en' : 'ko') : ''}
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.base, paddingVertical: S.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backTxt: { fontSize: 17, marginLeft: 4 },
  actions: { flexDirection: 'row', gap: S.lg, alignItems: 'center' },
  actTxt: { fontSize: 17, fontWeight: '600' },
  image: { width: '100%', height: 240, backgroundColor: '#1C1C1E', marginBottom: S.base },
  group: { marginHorizontal: S.base, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5 },
  field: { paddingHorizontal: S.base, paddingVertical: S.md, borderBottomWidth: 0.5 },
  fieldLabel: { fontSize: 13, marginBottom: 4 },
  fieldVal: { fontSize: 17 },
  input: { fontSize: 17, borderWidth: 1, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: S.sm },
  ts: { fontSize: 13, textAlign: 'center', marginTop: S.lg },
});
