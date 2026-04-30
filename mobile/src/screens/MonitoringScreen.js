import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Heart, Activity, Play, User } from 'lucide-react-native';
import { calculateThresholds, detectRiskLevel } from '../utils/healthEngine';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const MonitoringScreen = ({ user, colors, navigation }) => {
  const [vitals, setVitals] = useState({ hr: 0, spo2: 0, temp: 98.6 });
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const thresholds = calculateThresholds(user?.age || 25);
  const tags = ['Cardio Hub', 'Vitals Track', 'Strength', 'Diet Plan'];

  useEffect(() => {
    let interval;
    if (isMonitoring && auth.currentUser) {
      interval = setInterval(async () => {
        const hr = Math.floor(Math.random() * (130 - 68 + 1) + 68);
        const spo2 = Math.floor(Math.random() * (100 - 98 + 1) + 98);
        const temp = (97.5 + Math.random() * 2.2).toFixed(1);
        
        const newVitals = { hr, spo2, temp };
        const newRisk = detectRiskLevel(hr, spo2, thresholds);
        
        setVitals(newVitals);

        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(userRef, { currentHR: hr, currentSpO2: spo2, currentTemp: temp, lastUpdate: serverTimestamp(), status: newRisk.level }, { merge: true });
        } catch (e) { console.error("Sync Error", e); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, user?.age]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.membershipText}>GymCare {user?.goal || 'Member'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image 
            source={{ uri: `https://api.dicebear.com/7.x/personas/png?seed=${user?.name || 'User'}&backgroundColor=d8b4fe${user?.gender === 'Female' ? '&hair=long' : '&hair=short'}` }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Let's Monitor Now!</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
        {tags.map((tag, i) => (
          <View key={i} style={[styles.tag, { backgroundColor: i === 0 ? colors.green : i === 1 ? colors.pink : i === 2 ? colors.blue : '#E5E7EB' }]}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.cardsContainer}>
        
        {/* Heart Rate Card */}
        <View style={[styles.pastelCard, { backgroundColor: colors.yellow }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Heart Rate{"\n"}Monitoring</Text>
            
            <View style={styles.scoreContainer}>
               <Text style={styles.vitalsHuge}>{isMonitoring ? vitals.hr : '--'}</Text>
               <Text style={styles.vitalsSmall}>BPM</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.cardActionBtn} onPress={() => setIsMonitoring(!isMonitoring)}>
              <Text style={styles.cardActionText}>{isMonitoring ? 'Stop Tracking' : 'Start Tracking'}</Text>
            </TouchableOpacity>
            <View style={[styles.playBtn, { backgroundColor: '#111827' }]}>
              {isMonitoring ? <Activity size={18} color="#FFF" /> : <Play size={18} color="#FFF" fill="#FFF" />}
            </View>
          </View>
        </View>

        {/* Oxygen & Temp Card */}
        <View style={[styles.pastelCard, { backgroundColor: colors.purple, marginTop: 15 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Oxygen &{"\n"}Temperature</Text>
            
            <View style={styles.scoreContainerRight}>
               <View style={styles.miniScoreRow}>
                 <Text style={styles.vitalsMedium}>{isMonitoring ? vitals.spo2 : '--'}</Text>
                 <Text style={styles.vitalsSmallLabel}>% SpO2</Text>
               </View>
               <View style={styles.miniScoreRow}>
                 <Text style={styles.vitalsMedium}>{isMonitoring ? vitals.temp : '--'}</Text>
                 <Text style={styles.vitalsSmallLabel}>°F Temp</Text>
               </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.miniStatsRow}>
              <View style={styles.miniStatBox}>
                <Activity size={14} color="#111827" />
                <Text style={styles.miniStatVal}>Sensors Active</Text>
              </View>
            </View>
          </View>
        </View>

      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  greeting: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  membershipText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D8B4FE' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  heroSection: { paddingHorizontal: 20, paddingBottom: 15 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  tagScroll: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  tagText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  cardsContainer: { paddingHorizontal: 20 },
  pastelCard: { width: '100%', minHeight: 180, borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#111827', lineHeight: 26, flex: 1 },
  scoreContainer: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20, alignItems: 'center', minWidth: 90 },
  scoreContainerRight: { backgroundColor: 'rgba(255,255,255,0.5)', padding: 15, borderRadius: 20, minWidth: 100 },
  miniScoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
  vitalsHuge: { fontSize: 32, fontWeight: '900', color: '#111827' },
  vitalsMedium: { fontSize: 22, fontWeight: '900', color: '#111827' },
  vitalsSmall: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  vitalsSmallLabel: { fontSize: 10, fontWeight: '700', color: '#111827' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  cardActionBtn: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  cardActionText: { fontSize: 13, fontWeight: '700', color: '#111827' },
  playBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  miniStatsRow: { flexDirection: 'row', gap: 8 },
  miniStatBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 6 },
  miniStatVal: { fontSize: 12, fontWeight: '700', color: '#111827' }
});

export default MonitoringScreen;
