import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const FeesScreen = () => {
  const payments = [
    { id: '1', name: 'Alex Johnson', amount: '$50', status: 'Paid', date: '2024-04-01' },
    { id: '2', name: 'Sarah Miller', amount: '$50', status: 'Unpaid', date: '2024-04-01' },
    { id: '3', name: 'Mike Ross', amount: '$75', status: 'Paid', date: '2024-03-15' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments & Fees</Text>

      <FlatList
        data={payments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>Due: {item.date}</Text>
            </View>
            <View style={styles.rightSide}>
              <Text style={styles.amount}>{item.amount}</Text>
              <Text style={[styles.status, { color: item.status === 'Paid' ? '#4CAF50' : '#F44336' }]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
  card: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1E1E1E', padding: 15, borderRadius: 12, marginBottom: 10
  },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  date: { color: '#AAA', fontSize: 12 },
  rightSide: { alignItems: 'flex-end' },
  amount: { color: '#FFF', fontWeight: 'bold' },
  status: { fontSize: 12, fontWeight: 'bold', marginTop: 4 }
});

export default FeesScreen;
