import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const AttendanceScreen = () => {
  const [members, setMembers] = useState([
    { id: '1', name: 'Alex Johnson', status: 'Pending' },
    { id: '2', name: 'Sarah Miller', status: 'Present' },
    { id: '3', name: 'Mike Ross', status: 'Pending' }
  ]);

  const toggleAttendance = (id) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, status: m.status === 'Present' ? 'Pending' : 'Present' } : m
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Attendance</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      <FlatList
        data={members}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity 
              style={[styles.btn, item.status === 'Present' ? styles.btnPresent : styles.btnPending]}
              onPress={() => toggleAttendance(item.id)}
            >
              <Text style={styles.btnText}>{item.status}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  date: { color: '#AAA', marginBottom: 20 },
  card: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, marginBottom: 10
  },
  name: { color: '#FFF', fontSize: 16 },
  btn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, width: 100, alignItems: 'center' },
  btnPresent: { backgroundColor: '#4CAF50' },
  btnPending: { backgroundColor: '#333' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});

export default AttendanceScreen;
