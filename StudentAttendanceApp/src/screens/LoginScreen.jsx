import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import useAuth from '../hooks/useAuth';
import { validateLogin } from '../utils/validators';
import { COLORS } from '../utils/colors';

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('teacher@school.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const validation = validateLogin({ email, password });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    try {
      await login({ email, password });
    } catch (e) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.brand}>
            <Text style={styles.logo}>SA</Text>
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to record student attendance and surveys
          </Text>

          <View style={styles.form}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              error={errors.email}
            />
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              error={errors.password}
            />
            <CustomButton
              title="Sign in"
              onPress={handleLogin}
              loading={loading}
            />
          </View>

          <Text style={styles.hint}>
            Demo: any email + 6+ char password works.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  brand: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: { color: '#fff', fontSize: 26, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  form: { marginTop: 8 },
  hint: {
    marginTop: 20,
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
