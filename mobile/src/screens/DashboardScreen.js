import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, StatusBar } from 'react-native';
import MemberCard from '../components/MemberCard';

// Simulated initial data
const INITIAL_MEMBERS = [
  { id: '1', name: 'Alex Johnson', age: 28, gender: 'Male', status: 'Normal', lastHR: 72, lastSpO2: 98 },
  { id: '2', name: 'Sarah Miller', age: 34, gender: 'Female', status: 'Risk', lastHR: 165, lastSpO2: 93 },
  { id: '3', name: 'Mike Ross', age: 45, gender: 'Male', status: 'Normal', lastHR: 80, lastSpO2: 97 },
];

const DashboardScreen = ({ navigation }) => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState('');

  // Filter members based on search
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <Text style={styles.title}>GymCare Dashboard</Text>
        <Text style={styles.subtitle}>Active Members: {members.length}</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search members..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemberCard 
            member={item} 
            onPress={() => navigation.navigate('MemberDetail', { member: item })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No members found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20 },
  header: { marginTop: 60, marginBottom: 20 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#AAA', fontSize: 16, marginTop: 4 },
  searchBar: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  listContainer: { paddingBottom: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#888', fontSize: 16 }
});

export default DashboardScreen;
