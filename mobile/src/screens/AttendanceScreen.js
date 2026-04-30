import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Plus, Dumbbell, Calendar, Clock } from 'lucide-react-native';

const AttendanceScreen = ({ colors = { primary: '#6200EE', background: '#F8F9FA', card: '#FFFFFF', text: '#121212', lightText: '#666' } }) => {
  const [logs, setLogs] = useState([
    { id: '1', type: 'Cardio', duration: '30 mins', date: 'Today' },
    { id: '2', type: 'Strength', duration: '45 mins', date: 'Yesterday' },
  ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Workout Logs</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Log New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.iconBox}>
              <Dumbbell size={20} color={colors.primary} />
            </View>
            <View style={styles.details}>
              <Text style={[styles.logType, { color: colors.text }]}>{item.type}</Text>
              <View style={styles.metaRow}>
                <Calendar size={12} color={colors.lightText} />
                <Text style={styles.metaText}>{item.date}</Text>
                <View style={styles.separator} />
                <Clock size={12} color={colors.lightText} />
                <Text style={styles.metaText}>{item.duration}</Text>
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
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  title: { fontSize: 26, fontWeight: 'bold' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, gap: 8 },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  list: { paddingBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 22, marginBottom: 15, elevation: 2 },
  iconBox: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  details: { flex: 1 },
  logType: { fontSize: 16, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 },
  metaText: { fontSize: 11, color: '#888', fontWeight: '500' },
  separator: { width: 1, height: 10, backgroundColor: '#DDD', marginHorizontal: 5 }
});

export default AttendanceScreen;
