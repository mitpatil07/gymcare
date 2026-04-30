import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Dimensions, Animated, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { Ruler, Scale, Heart, ShieldAlert, Pill, Phone, User, Stethoscope, Clock, LogOut } from 'lucide-react-native';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = ({ user, colors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [activeSlide, setActiveSlide] = useState(0);
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const banners = [
    { id: 1, title: 'Stay Hydrated', text: 'Drink at least 8 glasses of water daily for optimal health.', img: 'https://images.unsplash.com/photo-1550963295-019d8a8a61c5?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, title: 'Daily Workout', text: 'Keep your heart healthy with 30 mins of daily cardio.', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const toggleEditing = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, formData);
      toggleEditing();
      Alert.alert("Success", "Your cloud health profile has been updated.");
    } catch (error) {
      Alert.alert("Sync Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => auth.signOut(), style: "destructive" }
    ]);
  };

  const InfoBlock = ({ label, value, field, keyboard = 'default', isMultiline = false }) => (
    <View style={styles.infoBlock}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput 
          style={[styles.input, isMultiline && styles.textArea]} 
          value={value?.toString()} 
          keyboardType={keyboard}
          multiline={isMultiline}
          onChangeText={(val) => setFormData({...formData, [field]: val})}
        />
      ) : (
        <Text style={styles.value}>{value || '--'}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.carouselContainer}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
          scrollEventThrottle={16}
        >
          {banners.map((item) => (
            <View key={item.id} style={styles.slide}>
              <Image source={{ uri: item.img }} style={styles.slideImg} />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {banners.map((_, i) => (
            <View key={i} style={[styles.dot, activeSlide === i && { backgroundColor: colors.primary, width: 20 }]} />
          ))}
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <View style={styles.summaryCard}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{user.name?.charAt(0)}</Text>
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.uName}>{user.name}</Text>
            <Text style={styles.uGoal}>Status: Connected to Cloud</Text>
          </View>
          <TouchableOpacity style={styles.editBtnSmall} onPress={toggleEditing}>
            <Text style={[styles.editBtnTextSmall, { color: colors.primary }]}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Parameters</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <InfoBlock label="Height" value={formData.height + " cm"} field="height" keyboard="numeric" />
              <InfoBlock label="Weight" value={formData.weight + " kg"} field="weight" keyboard="numeric" />
              <InfoBlock label="Blood" value={formData.bloodGroup} field="bloodGroup" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><ShieldAlert size={18} color={colors.red} /><Text style={styles.sectionTitle}>Medical Data</Text></View>
          <View style={styles.card}>
            <InfoBlock label="Any Chronic Disease?" value={formData.hasDisease} field="hasDisease" />
            {formData.hasDisease?.toLowerCase() === 'yes' && (
              <View style={styles.expandedMedical}>
                <InfoBlock label="Disease Name" value={formData.diseaseName} field="diseaseName" />
                <InfoBlock label="Symptoms" value={formData.symptoms} field="symptoms" />
                <InfoBlock label="Description" value={formData.diseaseDesc} field="diseaseDesc" isMultiline />
                <View style={styles.row}>
                  <InfoBlock label="Severity" value={formData.severity} field="severity" />
                  <InfoBlock label="Since" value={formData.sinceWhen} field="sinceWhen" />
                </View>
              </View>
            )}
          </View>
        </View>

        {formData.hasDisease?.toLowerCase() === 'yes' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Pill size={18} color={colors.orange} /><Text style={styles.sectionTitle}>Medication</Text></View>
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.orange }]}>
              <InfoBlock label="Medicine" value={formData.medicineName} field="medicineName" />
              <View style={styles.row}>
                <InfoBlock label="Dosage" value={formData.dosage} field="dosage" />
                <InfoBlock label="Frequency" value={formData.frequency} field="frequency" />
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Phone size={18} color={colors.red} /><Text style={styles.sectionTitle}>Emergency Contact</Text></View>
          <View style={styles.card}>
            <InfoBlock label="Number" value={formData.emergencyContact} field="emergencyContact" keyboard="phone-pad" />
            <InfoBlock label="Relation" value={formData.relation} field="relation" />
          </View>
        </View>

        <View style={styles.btnCol}>
          {isEditing ? (
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Sync to Cloud</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color={colors.red} />
              <Text style={[styles.logoutText, { color: colors.red }]}>Logout from GymCare</Text>
            </TouchableOpacity>
          )}
        </View>

      </Animated.View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  carouselContainer: { height: 200, marginBottom: 20 },
  slide: { width: width, height: 200, position: 'relative' },
  slideImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  slideOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  slideTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  slideText: { color: '#EEE', fontSize: 12, marginTop: 4 },
  pagination: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  summaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 20, padding: 15, borderRadius: 25, elevation: 3 },
  avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  summaryText: { flex: 1, marginLeft: 15 },
  uName: { fontSize: 18, fontWeight: 'bold', color: '#121212' },
  uGoal: { fontSize: 11, color: '#6200EE', marginTop: 2, fontWeight: 'bold' },
  editBtnSmall: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F3E5F5' },
  editBtnTextSmall: { fontSize: 12, fontWeight: 'bold' },
  section: { marginHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
  row: { flexDirection: 'row', gap: 15 },
  infoBlock: { flex: 1, marginBottom: 15 },
  label: { color: '#AAA', fontSize: 10, fontWeight: 'bold', marginBottom: 6 },
  value: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, color: '#121212', fontSize: 13, borderWidth: 1, borderColor: '#EEE' },
  textArea: { height: 80, textAlignVertical: 'top' },
  expandedMedical: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15 },
  btnCol: { marginHorizontal: 20, gap: 15 },
  saveBtn: { padding: 18, borderRadius: 20, alignItems: 'center', elevation: 4 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#FF5252', borderRadius: 15 },
  logoutText: { fontWeight: 'bold', fontSize: 14 }
});

export default ProfileScreen;
