import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
  type KeyboardTypeOptions, type TextInputProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import * as api from '../../lib/api';
import { auth } from '../../lib/firebase';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

type InputFieldProps = {
  icon: FeatherIconName;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
  showToggle?: boolean;
  showPass?: boolean;
  onTogglePass?: () => void;
};

const InputField = ({ icon, placeholder, value, onChangeText, keyboardType, autoCapitalize, secureTextEntry, showToggle, showPass, onTogglePass }: InputFieldProps) => {
  const theme = useTheme();
  return (
    <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]} accessibilityRole="none">
      <Feather name={icon} size={18} color={theme.textSecondary} accessible={false} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder} placeholderTextColor={theme.textTertiary}
        value={value} onChangeText={onChangeText}
        keyboardType={keyboardType} autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        accessibilityRole="text" accessibilityLabel={placeholder}
      />
      {showToggle && (
        <Pressable onPress={onTogglePass} accessibilityRole="button"
          accessibilityLabel={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          accessibilityState={{ expanded: showPass }}>
          <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const register = async () => {
    try {
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
      await api.register(email, password);
      await api.login(email, password);
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'auth/email-already-in-use') setError('Este email ya está registrado');
      else if (err.code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres');
      else setError('Error al registrarse');
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      accessibilityLabel="Pantalla de registro">
      <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
        <View style={styles.header} accessibilityRole="header" accessibilityLabel="Crear cuenta">
          <View style={[styles.logo, { backgroundColor: theme.primary + '20' }]}>
            <Feather name="user-plus" size={34} color={theme.primary} accessible={false} />
          </View>
          <Text style={[styles.titulo, { color: theme.text }]}>Crear cuenta</Text>
          <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>Regístrate para empezar</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <InputField icon="user" placeholder="Nombre" value={name} onChangeText={setName} />
          <InputField icon="mail" placeholder="Email" value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" />
          <InputField icon="lock" placeholder="Contraseña" value={password} onChangeText={setPassword}
            secureTextEntry={!showPass} showToggle showPass={showPass} onTogglePass={() => setShowPass(p => !p)} />

          {!!error && <Text style={[styles.error, { color: theme.danger }]} accessibilityRole="alert">{error}</Text>}

          <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85} onPress={register}
            accessibilityRole="button" accessibilityLabel="Registrarse">
            <Text style={styles.btnText}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button" accessibilityLabel="Ir a inicio de sesión">
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            ¿Ya tienes cuenta?{' '}
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Inicia sesión</Text>
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
  link: { textAlign: 'center', marginTop: 28, fontSize: 15 },
});