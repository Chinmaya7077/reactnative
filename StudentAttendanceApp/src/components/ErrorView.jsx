import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import { COLORS } from '../utils/colors';

export default function ErrorView({ message = 'Something went wrong', onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <CustomButton title="Retry" onPress={onRetry} variant="outline" style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.danger, marginBottom: 6 },
  message: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  btn: { marginTop: 16, paddingHorizontal: 28 },
});
