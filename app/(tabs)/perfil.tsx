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

        const imageRes = await fetch(uri);
        const blob = await imageRes.blob();

        await fetch(signedUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': fileType },
        });

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

      <View style={[styles.avatarBlock, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.avatarWrapper}>
          
          <View style={[styles.avatarBorder, { borderColor: theme.primary }]}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.primary + '55', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.avatarText}>
                  {profile?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.changePhotoBtn, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.changePhotoText, { color: theme.primary }]}>
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
            </Text>
          </View>

        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
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

  avatarBlock: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
  },

  avatarWrapper: {
    alignItems: 'center',
    width: '100%',
  },

  avatarBorder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    padding: 6,
    marginBottom: 18,
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },

  avatarText: {
    fontSize: 52,
    fontWeight: '800',
    color: '#fff',
  },

  changePhotoBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 14,
  },

  changePhotoText: {
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '100%',
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },

  email: {
    fontSize: 17,
    marginBottom: 30,
  },

  btn: {
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
