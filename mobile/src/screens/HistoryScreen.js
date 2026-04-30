import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, MoreHorizontal, BookOpen, Activity } from 'lucide-react-native';

const HistoryScreen = ({ history = [], colors, navigation }) => {
  // Generate actual current week dates
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const generateWeek = () => {
    const week = [];
    const current = new Date(today);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday
    for (let i = 0; i < 7; i++) {
      week.push({
        dayName: dayNames[i],
        date: current.getDate(),
        isToday: current.getDate() === today.getDate() && current.getMonth() === today.getMonth()
      });
      current.setDate(current.getDate() + 1);
    }
    return week;
  };
  
  const weekData = generateWeek();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Health History</Text>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Calendar Strip */}
      <View style={styles.calendarSection}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>{currentMonth}</Text>
        </View>

        <View style={styles.daysRow}>
          {weekData.map((d, i) => (
            <View key={i} style={[styles.dayCol, d.isToday && { backgroundColor: '#111827' }]}>
              <Text style={[styles.dayName, d.isToday && { color: '#FFF' }]}>{d.dayName}</Text>
              <Text style={[styles.dayNum, d.isToday && { color: '#FFF' }]}>{d.date}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <TouchableOpacity><Text style={styles.seeAll}>Stats</Text></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        <View style={[styles.progressCard, { backgroundColor: colors.purple }]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}><Activity size={14} color="#111827" /></View>
          </View>
          <Text style={styles.cardTitle}>Cardio Endurance</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: '52%', backgroundColor: '#111827' }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPct}>52%</Text>
          </View>
        </View>

        <View style={[styles.progressCard, { backgroundColor: colors.blue }]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}><BookOpen size={14} color="#111827" /></View>
          </View>
          <Text style={styles.cardTitle}>Vitals Stability</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: '85%', backgroundColor: '#111827' }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPct}>85%</Text>
          </View>
        </View>
      </ScrollView>

      {/* Recent Logs Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Logs</Text>
      </View>

      <View style={styles.logList}>
        <View style={[styles.logCard, { backgroundColor: colors.yellow }]}>
           <Text style={styles.logTitle}>Morning Run</Text>
           <Text style={styles.logSub}>Avg HR: 125 BPM</Text>
        </View>
        <View style={[styles.logCard, { backgroundColor: colors.pink }]}>
           <Text style={styles.logTitle}>Resting Check</Text>
           <Text style={styles.logSub}>SpO2: 99%</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
  circleBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  calendarSection: { paddingHorizontal: 20, marginBottom: 20 },
  monthHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  monthText: { fontSize: 13, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 16 },
  activeDayCol: { backgroundColor: '#111827' },
  dayName: { fontSize: 10, color: '#6B7280', marginBottom: 6, fontWeight: '600' },
  dayNum: { fontSize: 13, color: '#111827', fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#D8B4FE' },
  horizontalScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 10 },
  progressCard: { width: 180, height: 130, borderRadius: 24, padding: 15, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginTop: 8 },
  progressBarContainer: { height: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, marginTop: 10 },
  progressBarFill: { height: '100%', borderRadius: 2 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  progressLabel: { fontSize: 10, color: 'rgba(0,0,0,0.5)', fontWeight: '600' },
  progressPct: { fontSize: 11, fontWeight: '800', color: '#111827' },
  logList: { paddingHorizontal: 20, gap: 12 },
  logCard: { padding: 18, borderRadius: 24, height: 90, justifyContent: 'center' },
  logTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  logSub: { fontSize: 12, color: 'rgba(0,0,0,0.5)', fontWeight: '700', marginTop: 2 }
});

export default HistoryScreen;
