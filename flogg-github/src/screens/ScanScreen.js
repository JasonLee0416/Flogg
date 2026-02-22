import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { useSettings } from '../context/SettingsContext';
import { useDatabase } from '../database/DatabaseContext';
import { Colors, S } from '../utils/theme';
import { i18n } from '../i18n/strings';
import { extractReceiptData } from '../services/visionApi';

export default function ScanScreen({ navigation }) {
  const { isDark, lang, cameraMode, imageQuality, autoAnalyze } = useSettings();
  const { addReceipt } = useDatabase();
  const insets = useSafeAreaInsets();
  const c = isDark ? Colors.dark : Colors.light;
  const t = i18n[lang];
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [processing, setProcessing] = useState(false);
  const [batchCount, setBatchCount] = useState(0);

  if (!permission) return <View style={[styles.container, { backgroundColor: '#0A1628' }]} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: '#0A1628', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 48, opacity: 0.4 }}>📷</Text>
        <Text style={styles.permTxt}>{t.permNeeded}</Text>
        <TouchableOpacity style={[styles.permBtn, { backgroundColor: c.blue }]} onPress={requestPermission}>
          <Text style={styles.permBtnTxt}>{t.permAllow}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const capture = async () => {
    if (!cameraRef.current || processing) return;
    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: imageQuality === 'high' ? 0.8 : 0.4 });
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: imageQuality === 'high' ? 1024 : 640 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      let receiptData = { imageUri: resized.uri, destination: '', orderer: '', productDetail: '', ribbonText: '', rawResponse: '', memo: '' };

      if (autoAnalyze) {
        const base64 = await FileSystem.readAsStringAsync(resized.uri, { encoding: FileSystem.EncodingType.Base64 });
        const result = await extractReceiptData(base64);
        receiptData = { ...receiptData, ...result };
      }

      await addReceipt(receiptData);

      if (cameraMode === 'batch') {
        setBatchCount(prev => prev + 1);
      } else {
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert(t.error, e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <View style={[styles.topBar, { paddingTop: insets.top + S.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '600' }}>‹</Text>
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: cameraMode === 'batch' ? 'rgba(255,159,10,0.25)' : 'rgba(10,132,255,0.25)' }]}>
          <Text style={[styles.badgeTxt, { color: cameraMode === 'batch' ? '#FF9F0A' : '#0A84FF' }]}>
            {cameraMode === 'batch' ? t.batchMode : t.singleMode}
            {cameraMode === 'batch' && batchCount > 0 ? ` (${batchCount})` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.guideWrap}>
        <View style={styles.guideBox}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
      </View>

      <Text style={styles.hint}>{t.scanHint}</Text>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        {cameraMode === 'batch' && batchCount > 0 && (
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: c.green }]} onPress={() => navigation.goBack()}>
            <Text style={styles.doneTxt}>{t.done} ({batchCount})</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.capBtn} onPress={capture} disabled={processing} activeOpacity={0.7}>
          {processing ? <ActivityIndicator color="#fff" size="small" /> : <View style={styles.capInner} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const C = { position: 'absolute', width: 30, height: 30 };
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.base },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  badgeTxt: { fontSize: 12, fontWeight: '600' },
  guideWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50 },
  guideBox: { width: '100%', aspectRatio: 3 / 4, borderWidth: 1.5, borderColor: 'rgba(77,123,243,0.2)', borderRadius: 20 },
  corner: { ...C },
  tl: { top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#4D8BFF', borderTopLeftRadius: 14 },
  tr: { top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#4D8BFF', borderTopRightRadius: 14 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#4D8BFF', borderBottomLeftRadius: 14 },
  br: { bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#4D8BFF', borderBottomRightRadius: 14 },
  hint: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: S.lg },
  bottom: { alignItems: 'center', gap: 12 },
  capBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  capInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
  doneBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  doneTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  permTxt: { color: 'rgba(255,255,255,0.6)', fontSize: 17, marginTop: 16, marginBottom: 24 },
  permBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  permBtnTxt: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
