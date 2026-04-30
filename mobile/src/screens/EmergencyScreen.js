import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Phone, ShieldAlert, Navigation, PhoneCall, Heart, User } from 'lucide-react-native';

const EmergencyScreen = ({ route }) => {
  const hospitalList = [
    { id: '1', name: 'City General Hospital', contact: '+1 800-555-0199', dist: '1.2 km' },
    { id: '2', name: 'Metro Health Center', contact: '+1 800-555-0122', dist: '2.5 km' },
    { id: '3', name: 'Sunrise Urgent Care', contact: '+1 800-555-0155', dist: '4.1 km' },
  ];

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const ServiceCard = ({ icon: Icon, label, number, color }) => (
    <TouchableOpacity 
      style={[styles.serviceCard, { borderColor: color + '30' }]}
      onPress={() => handleCall(number)}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.serviceLabel}>{label}</Text>
      <Text style={[styles.serviceNumber, { color: color }]}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.alertHeader}>
        <ShieldAlert size={32} color="#FF5252" />
        <Text style={styles.alertTitle}>Emergency Hub</Text>
        <Text style={styles.alertSubtitle}>Instant response for critical situations</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Assistance</Text>
        <View style={styles.servicesGrid}>
          <ServiceCard icon={PhoneCall} label="Ambulance" number="108" color="#FF5252" />
          <ServiceCard icon={PhoneCall} label="Police" number="100" color="#2196F3" />
          <ServiceCard icon={PhoneCall} label="Fire" number="101" color="#FF9800" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
        {hospitalList.map(h => (
          <View key={h.id} style={styles.hospitalCard}>
            <View style={styles.hospitalInfo}>
              <Text style={styles.hName}>{h.name}</Text>
              <View style={styles.hMeta}>
                <Navigation size={12} color="#888" />
                <Text style={styles.hDist}>{h.dist}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(h.contact)}>
              <Phone size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.emergencyProfile, { backgroundColor: '#FFF' }]}>
        <View style={styles.profileHeader}>
          <User size={18} color="#6200EE" />
          <Text style={styles.profileTitle}>Your Emergency Profile</Text>
        </View>
        <View style={styles.profileRow}>
          <View style={styles.pItem}><Text style={styles.pLabel}>Primary Contact</Text><Text style={styles.pVal}>Brother</Text></View>
          <View style={styles.pItem}><Text style={styles.pLabel}>Number</Text><Text style={styles.pVal}>9876543210</Text></View>
          <View style={styles.pItem}><Text style={styles.pLabel}>Blood Group</Text><Text style={[styles.pVal, { color: '#FF5252' }]}>B+</Text></View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  alertHeader: { alignItems: 'center', marginVertical: 30 },
  alertTitle: { fontSize: 24, fontWeight: 'bold', color: '#121212', marginTop: 10 },
  alertSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  servicesGrid: { flexDirection: 'row', gap: 10 },
  serviceCard: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  serviceLabel: { fontSize: 11, color: '#666', fontWeight: '500' },
  serviceNumber: { fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  hospitalCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 22, 
    alignItems: 'center', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  hospitalInfo: { flex: 1 },
  hName: { fontSize: 16, fontWeight: 'bold', color: '#121212' },
  hMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  hDist: { fontSize: 12, color: '#888' },
  callBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  emergencyProfile: { padding: 20, borderRadius: 24, borderLeftWidth: 5, borderLeftColor: '#6200EE', elevation: 2 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  profileTitle: { fontSize: 14, fontWeight: 'bold', color: '#121212' },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pItem: { alignItems: 'flex-start' },
  pLabel: { fontSize: 10, color: '#AAA', marginBottom: 2 },
  pVal: { fontSize: 12, fontWeight: 'bold', color: '#333' }
});

export default EmergencyScreen;
