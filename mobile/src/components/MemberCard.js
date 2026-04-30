import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const MemberCard = ({ member, onPress }) => {
  const isRisk = member.status === 'Risk';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        {/* Profile Image / Initials */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.info}>Age: {member.age} | {member.gender}</Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.badge, { backgroundColor: isRisk ? '#FF5252' : '#4CAF50' }]}>
          <Text style={styles.badgeText}>{member.status}</Text>
        </View>
      </View>
      
      {/* Mini Vitals Preview */}
      <View style={styles.vitalsPreview}>
        <Text style={styles.vitalMiniText}>HR: <Text style={styles.vitalValue}>{member.lastHR} BPM</Text></Text>
        <Text style={styles.vitalMiniText}>SpO2: <Text style={styles.vitalValue}>{member.lastSpO2}%</Text></Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    elevation: 4, // Android Shadow
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#3700B3', justifyContent: 'center', alignItems: 'center'
  },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, marginLeft: 12 },
  name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  info: { color: '#AAA', fontSize: 14, marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  vitalsPreview: { 
    flexDirection: 'row', justifyContent: 'space-around', 
    marginTop: 12, pt: 12, borderTopWidth: 1, borderTopColor: '#333' 
  },
  vitalMiniText: { color: '#888', fontSize: 12 },
  vitalValue: { color: '#CCC', fontWeight: 'bold' }
});

export default MemberCard;
