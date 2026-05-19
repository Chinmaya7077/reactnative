import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import Dropdown from '../components/Dropdown';
import InputField from '../components/InputField';
import { submitSurvey } from '../services/api';
import {
  ATTENDANCE_OPTIONS,
  CLASS_OPTIONS,
} from '../utils/constants';
import { COLORS } from '../utils/colors';
import { validateSurvey } from '../utils/validators';

export default function FormScreen({ navigation }) {
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      includeBase64: false,
    });
    if (result.didCancel) return;
    if (result.errorMessage) {
      Alert.alert('Image error', result.errorMessage);
      return;
    }
    const asset = result.assets?.[0];
    if (asset) setPhoto(asset);
  };

  const handleSubmit = async () => {
    const validation = validateSurvey({ studentName, className, status });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    try {
      await submitSurvey({
        studentName,
        className,
        status,
        note,
        photoUri: photo?.uri || null,
      });
      Alert.alert('Submitted', 'Attendance entry saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Submission failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container}>
          <InputField
            label="Student Name"
            value={studentName}
            onChangeText={setStudentName}
            placeholder="e.g. Aarav Sharma"
            autoCapitalize="words"
            error={errors.studentName}
          />
          <Dropdown
            label="Class"
            selectedValue={className}
            onValueChange={setClassName}
            options={CLASS_OPTIONS}
            error={errors.className}
          />
          <Dropdown
            label="Attendance Status"
            selectedValue={status}
            onValueChange={setStatus}
            options={ATTENDANCE_OPTIONS}
            error={errors.status}
          />
          <InputField
            label="Notes (optional)"
            value={note}
            onChangeText={setNote}
            placeholder="Any additional information"
            multiline
          />

          <Text style={styles.label}>Attach Photo (optional)</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.image} />
            ) : (
              <Text style={styles.imageHint}>Tap to choose image</Text>
            )}
          </TouchableOpacity>

          <CustomButton
            title="Submit Attendance"
            onPress={handleSubmit}
            loading={submitting}
            style={styles.submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { padding: 16 },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 6,
    marginTop: 4,
    fontWeight: '600',
  },
  imageBox: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: { width: '100%', height: '100%' },
  imageHint: { color: COLORS.textMuted },
  submit: { marginTop: 8 },
});
