import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { COLORS } from '../utils/colors';

const DASHBOARD_CARDS = [
  { id: '1', title: 'Today’s Attendance', subtitle: '32 of 40 marked present', badge: 'Live' },
  { id: '2', title: 'Pending Surveys', subtitle: '4 surveys awaiting submission', badge: '4' },
  { id: '3', title: 'New Notices', subtitle: '2 announcements from the school', badge: '2' },
  { id: '4', title: 'Upcoming Holidays', subtitle: 'Republic Day · 26 Jan' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header
          title={`Hello, ${user?.name?.split(' ')[0] || 'Teacher'}`}
          subtitle="Here is your dashboard summary"
        />
        <View>
          {DASHBOARD_CARDS.map(c => (
            <Card
              key={c.id}
              title={c.title}
              subtitle={c.subtitle}
              badge={c.badge}
              onPress={() =>
                c.id === '2'
                  ? navigation.navigate('Attendance')
                  : navigation.navigate('Form')
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16 },
});
