import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';

const API_URL = 'https://noteflow-api.vercel.app/api';

export default function PerfilScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    if (!user) return;
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((doc) => {
        setProfile(doc.data());
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await auth().signOut();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Necesitamos permisos para acceder a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop() ?? 'avatar.jpg';
        const fileType = 'image/jpeg';

        // 1. Obtener URL firmada del backend
        const token = await user!.getIdToken();
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileName, fileType }),
        });
        const { signedUrl, publicUrl } = await res.json();

        // 2. Convertir URI a Blob
        const imageRes = await fetch(uri);
        const blob = await imageRes.blob();

        // 3. Subir a S3
        await fetch(signedUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': fileType },
        });

        // 4. Guardar URL en Firestore
        await firestore().collection('users').doc(user!.uid).update({
          avatarUrl: publicUrl,
        });
      } catch (e) {
        alert('Error al subir la imagen');
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + 40 }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.primary + '33', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={styles.avatarText}>
                {profile?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.changePhoto, { color: uploading ? theme.textTertiary : theme.primary }]}>
            {uploading ? 'Subiendo...' : 'Cambiar foto'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.name, { color: theme.text }]}>
          {profile?.name ?? 'Sin nombre'}
        </Text>

        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {user?.email}
        </Text>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.danger }]}
          activeOpacity={0.85}
          onPress={logout}
        >
          <Text style={styles.btnText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
  },
  changePhoto: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 26,
  },
  btn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});