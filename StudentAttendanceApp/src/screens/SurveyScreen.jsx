import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import ErrorView from '../components/ErrorView';
import Header from '../components/Header';
import Loader from '../components/Loader';
import useFetch from '../hooks/useFetch';
import { fetchAttendanceList } from '../services/api';
import { COLORS } from '../utils/colors';

const STATUS_COLORS = {
  present: COLORS.success,
  absent: COLORS.danger,
  late: COLORS.warning,
};

export default function SurveyScreen({ navigation }) {
  const { data, loading, error, refetch } = useFetch(fetchAttendanceList, []);

  if (loading && !data) return <Loader message="Fetching records..." />;
  if (error) return <ErrorView message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Header
          title="Attendance Records"
          subtitle={`${data?.length || 0} survey entries`}
        />
        <FlatList
          data={data}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No records yet. Add one!</Text>
          }
          renderItem={({ item }) => (
            <Card
              title={item.studentName}
              subtitle={`${item.className} · ${item.note?.slice(0, 60)}...`}>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: STATUS_COLORS[item.status] || COLORS.textMuted },
                ]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
            </Card>
          )}
        />
        <CustomButton
          title="+ Add New Entry"
          onPress={() => navigation.navigate('Form')}
          style={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 16 },
  list: { paddingBottom: 80 },
  empty: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40 },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  fab: { position: 'absolute', left: 16, right: 16, bottom: 16 },
});
