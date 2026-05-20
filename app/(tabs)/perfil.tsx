import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';

export default function PerfilScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top + 40 },
      ]}
    >
      {/* CARD CENTRAL */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.primary + '33' },
          ]}
        >
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0).toUpperCase() ??
              user?.email?.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Nombre */}
        <Text style={[styles.name, { color: theme.text }]}>
          {profile?.name ?? 'Sin nombre'}
        </Text>

        {/* Email */}
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {user?.email}
        </Text>

        {/* Botón logout */}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
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
