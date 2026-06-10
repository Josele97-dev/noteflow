import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Platform, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { auth, db } from '../../lib/firebase';

const API_URL = 'https://noteflow-api.vercel.app/api';

type Profile = { name?: string; avatarUrl?: string };

export default function PerfilScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfile(snap.data() as Profile);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const logout = async () => { await signOut(auth); };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (result.canceled || !user) return;
    setUploading(true);

    try {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop() ?? 'avatar.jpg';
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName, fileType: 'image/jpeg' }),
      });
      const { signedUrl, publicUrl } = await res.json();
      const imageRes = await fetch(uri);
      const blob = await imageRes.blob();
      await fetch(signedUrl, { method: 'PUT', body: blob, headers: { 'Content-Type': 'image/jpeg' } });
      await updateDoc(doc(db, 'users', user.uid), { avatarUrl: publicUrl });
    } catch {
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const initial = profile?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + 40 }]}>
      <View style={[styles.avatarBlock, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.avatarWrapper} activeOpacity={0.85}>
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.primary + '55', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            )}
          </View>
          <View style={[styles.changePhotoBtn, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.changePhotoText, { color: theme.primary }]}>{uploading ? 'Subiendo...' : 'Cambiar foto'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.name, { color: theme.text }]}>{profile?.name ?? 'Sin nombre'}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.danger }]} activeOpacity={0.85} onPress={logout}>
          <Text style={styles.btnText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cardShadow = Platform.select({
  web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' },
  default: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
});

const blockShadow = Platform.select({
  web: { boxShadow: '0px 2px 10px rgba(0,0,0,0.06)' },
  default: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  center: { justifyContent: 'center', alignItems: 'center' },
  avatarBlock: { width: '100%', borderWidth: 1, borderRadius: 32, paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center', marginBottom: 30, ...blockShadow },
  avatarWrapper: { alignItems: 'center', width: '100%' },
  avatarBorder: { width: 150, height: 150, borderRadius: 75, borderWidth: 5, padding: 6, marginBottom: 18 },
  avatar: { width: '100%', height: '100%', borderRadius: 75 },
  avatarText: { fontSize: 52, fontWeight: '800', color: '#fff' },
  changePhotoBtn: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14 },
  changePhotoText: { fontSize: 16, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: 28, padding: 28, alignItems: 'center', width: '100%', ...cardShadow },
  name: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  email: { fontSize: 17, marginBottom: 30 },
  btn: { height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', width: '100%' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});