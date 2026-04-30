import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Image } from 'react-native';
import { Heart, Activity, Zap, Thermometer, ShieldAlert, ChevronRight, TrendingUp } from 'lucide-react-native';
import { calculateThresholds, detectRiskLevel } from '../utils/healthEngine';

const { width } = Dimensions.get('window');

const MonitoringScreen = ({ user, colors, navigation }) => {
  const [vitals, setVitals] = useState({ hr: 0, spo2: 0, temp: 98.6 });
  const [risk, setRisk] = useState({ level: 'NORMAL', color: colors.green, action: 'Stable' });
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const thresholds = calculateThresholds(user.age);

  // High-fidelity cloud banners
  const heroBanners = [
    { id: 1, title: 'Health Monitoring', subtitle: 'Live HR & SpO2 tracking', img: 'https://images.unsplash.com/photo-1576091160550-2173dad99d1b?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, title: 'Smart Insights', subtitle: 'Personalized clinical logs', img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1000' },
  ];

  useEffect(() => {
    if (isMonitoring) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isMonitoring]);

  useEffect(() => {
    let interval;
    if (isMonitoring) {
      interval = setInterval(() => {
        const hr = Math.floor(Math.random() * (130 - 65 + 1) + 65);
        const spo2 = Math.floor(Math.random() * (100 - 97 + 1) + 97);
        const temp = (97.5 + Math.random() * 2.1).toFixed(1);
        setVitals({ hr, spo2, temp });
        setRisk(detectRiskLevel(hr, spo2, thresholds));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, user.age]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.carouselSection}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {heroBanners.map((item, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const scale = scrollX.interpolate({ inputRange, outputRange: [0.95, 1, 0.95], extrapolate: 'clamp' });
            return (
              <Animated.View key={item.id} style={[styles.heroSlide, { transform: [{ scale }] }]}>
                <Image source={{ uri: item.img }} style={styles.heroImg} />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSub}>{item.subtitle}</Text>
                </View>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Health Overview</Text>
          <View style={[styles.miniBadge, { backgroundColor: '#EDE7F6' }]}>
            <TrendingUp size={10} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>{user.goal}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.sosBtn, { backgroundColor: colors.red }]} onPress={() => navigation.navigate('Emergency')}>
          <ShieldAlert size={18} color="#FFF" />
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.vitalsContainer}>
        <View style={styles.vitalsRow}>
          <View style={[styles.vCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCirc, { backgroundColor: '#FFEBEE' }]}><Heart size={18} color={colors.red} fill={colors.red} /></View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}><Text style={styles.vNum}>{vitals.hr || '--'}</Text></Animated.View>
            <Text style={styles.vLab}>Pulse (BPM)</Text>
          </View>
          
          <View style={[styles.vCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCirc, { backgroundColor: '#E3F2FD' }]}><Activity size={18} color={colors.blue} /></View>
            <Text style={styles.vNum}>{vitals.spo2 || '--'}</Text>
            <Text style={styles.vLab}>Oxygen (%)</Text>
          </View>
          
          <View style={[styles.vCard, { backgroundColor: colors.card }]}>
            <View style={[styles.iconCirc, { backgroundColor: '#FFF3E0' }]}><Thermometer size={18} color={colors.orange} /></View>
            <Text style={styles.vNum}>{isMonitoring ? vitals.temp : '--'}</Text>
            <Text style={styles.vLab}>Temp (°F)</Text>
          </View>
        </View>

        <View style={[styles.statusBanner, { backgroundColor: risk.color + '15', borderColor: risk.color }]}>
          <Zap size={16} color={risk.color} fill={risk.color} />
          <Text style={[styles.statusMsg, { color: risk.color }]}>{isMonitoring ? `SYSTEM: ${risk.level}` : 'READY TO MONITOR'}</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={[styles.mainAction, { backgroundColor: isMonitoring ? '#333' : colors.primary }]}
          onPress={() => setIsMonitoring(!isMonitoring)}
        >
          <Activity size={24} color="#FFF" />
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>{isMonitoring ? 'Stop Session' : 'Start Monitoring'}</Text>
            <Text style={styles.actionSub}>{isMonitoring ? 'Data recording active' : 'Sync your biometric sensors'}</Text>
          </View>
          <ChevronRight size={20} color="#FFF" opacity={0.5} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  carouselSection: { height: 220, marginTop: 10 },
  heroSlide: { width: width, paddingHorizontal: 15, height: 200, position: 'relative' },
  heroImg: { position: 'absolute', top: 0, left: 15, right: 15, bottom: 0, width: width - 30, height: 200, borderRadius: 30, resizeMode: 'cover' },
  heroOverlay: { position: 'absolute', bottom: 20, left: 35, backgroundColor: 'rgba(255,255,255,0.9)', padding: 12, borderRadius: 18, elevation: 5 },
  heroTitle: { fontSize: 16, fontWeight: 'bold', color: '#121212' },
  heroSub: { fontSize: 11, color: '#666', marginTop: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#121212' },
  miniBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 5, marginTop: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  sosBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, gap: 6, elevation: 4 },
  sosText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  vitalsContainer: { marginHorizontal: 20, marginBottom: 25 },
  vitalsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  vCard: { flex: 1, padding: 15, borderRadius: 24, alignItems: 'center', elevation: 2 },
  iconCirc: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  vNum: { fontSize: 20, fontWeight: 'bold', color: '#121212' },
  vLab: { fontSize: 8, color: '#AAA', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 15, borderWidth: 1, gap: 10 },
  statusMsg: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  actionSection: { marginHorizontal: 20 },
  mainAction: { flexDirection: 'row', alignItems: 'center', padding: 22, borderRadius: 28, elevation: 5 },
  actionTextCol: { flex: 1, marginLeft: 15 },
  actionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  actionSub: { color: '#FFF', fontSize: 12, opacity: 0.7, marginTop: 2 }
});

export default MonitoringScreen;
