import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const AddMemberScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    medicalHistory: ''
  });

  const handleSave = () => {
    if (!form.name || !form.age) {
      Alert.alert("Error", "Please fill name and age.");
      return;
    }
    
    // Logic to save to backend (Node.js API)
    console.log("Saving Member:", form);
    Alert.alert("Success", "Member added successfully.");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Gym Member</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter name" 
          placeholderTextColor="#666"
          value={form.name}
          onChangeText={(val) => setForm({...form, name: val})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter age" 
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={form.age}
          onChangeText={(val) => setForm({...form, age: val})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {['Male', 'Female', 'Other'].map((g) => (
            <TouchableOpacity 
              key={g}
              style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
              onPress={() => setForm({...form, gender: g})}
            >
              <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Medical History</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Allergies, chronic conditions, etc." 
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={form.medicalHistory}
          onChangeText={(val) => setForm({...form, medicalHistory: val})}
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Register Member</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 30, marginTop: 40 },
  formGroup: { marginBottom: 20 },
  label: { color: '#AAA', fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { 
    flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, 
    borderColor: '#333', alignItems: 'center' 
  },
  genderBtnActive: { backgroundColor: '#3700B3', borderColor: '#3700B3' },
  genderText: { color: '#AAA' },
  genderTextActive: { color: '#FFF', fontWeight: 'bold' },
  saveBtn: { 
    backgroundColor: '#BB86FC', padding: 15, borderRadius: 10, 
    alignItems: 'center', marginTop: 30, marginBottom: 50 
  },
  saveBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});

export default AddMemberScreen;
