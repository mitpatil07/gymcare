import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Heart, Droplets, Calendar } from 'lucide-react-native';

const HistoryScreen = ({ history, colors }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Health History</Text>
        <Text style={[styles.subtitle, { color: colors.lightText }]}>Your past 7 days performance</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <View style={styles.dateRow}>
              <Calendar size={14} color={colors.lightText} />
              <Text style={[styles.dateText, { color: colors.lightText }]}>{item.date}</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Heart size={20} color="#FF5252" fill="#FF5252" />
                <View style={styles.statText}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{item.hr}</Text>
                  <Text style={styles.statUnit}>BPM</Text>
                </View>
              </View>

              <View style={styles.stat}>
                <Droplets size={20} color="#2196F3" fill="#2196F3" />
                <View style={styles.statText}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{item.spo2}</Text>
                  <Text style={styles.statUnit}>%</Text>
                </View>
              </View>

              <View style={[styles.badge, { backgroundColor: item.status === 'Warning' ? '#FFF3E0' : '#E8F5E9' }]}>
                <Text style={[styles.badgeText, { color: item.status === 'Warning' ? '#EF6C00' : '#2E7D32' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  list: { padding: 15 },
  card: { padding: 16, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
  dateText: { fontSize: 12, fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { alignItems: 'flex-start' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statUnit: { fontSize: 10, color: '#AAA', fontWeight: '500' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: 'bold' }
});

export default HistoryScreen;
