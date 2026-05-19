import { Feather } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import * as api from '../../lib/api';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    try {
      setError('');
      await auth().signInWithEmailAndPassword(email, password);
      await api.login(email, password);
    } catch {
      setError('Email o contraseña incorrectos');
    }
  };

  // 🔥 Tipado completo para evitar errores
  const Input = ({
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
  }: {
    icon: any;
    placeholder: string;
    value: string;
    onChangeText: (t: string) => void;
    keyboardType?: string;
    autoCapitalize?: string;
    secureTextEntry?: boolean;
  }) => (
    <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <Feather name={icon} size={18} color={theme.textSecondary} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType as any}
        autoCapitalize={autoCapitalize as any}
        secureTextEntry={secureTextEntry}
      />
      {icon === 'lock' && (
        <Pressable onPress={() => setShowPass(!showPass)}>
          <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: theme.primary + '20' }]}>
            <Feather name="lock" size={34} color={theme.primary} />
          </View>
          <Text style={[styles.titulo, { color: theme.text }]}>Bienvenido</Text>
          <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>Inicia sesión para continuar</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Input icon="mail" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input icon="lock" placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          {!!error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
          <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} activeOpacity={0.85} onPress={login}>
            <Text style={styles.btnText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/register' as any)}>
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            ¿No tienes cuenta? <Text style={{ color: theme.primary, fontWeight: '700' }}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 40, marginBottom: 36 },
  logo: { width: 74, height: 74, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  titulo: { fontSize: 36, fontWeight: '800', marginBottom: 8, letterSpacing: -1 },
  subtitulo: { fontSize: 16, lineHeight: 22 },
  card: { borderWidth: 1, borderRadius: 28, padding: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, height: 58, marginBottom: 14 },
  input: { flex: 1, fontSize: 16, marginLeft: 10 },
  error: { fontSize: 14, marginBottom: 12, marginTop: 2 },
  btn: { height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { textAlign: 'center', marginTop: 28, fontSize: 15 }
});
