import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Dimensions, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ruler, Scale, Heart, ShieldAlert, Pill, Phone, User, Stethoscope, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = ({ user, onUpdate, colors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // FIXED: Reliable cloud URLs for images
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

  const updateField = (field, val) => {
    if (field === 'hasDisease') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }
    setFormData({ ...formData, [field]: val });
  };

  const handleSave = () => {
    onUpdate(formData);
    toggleEditing();
    Alert.alert("Profile Synced", "All health parameters have been updated.");
  };

  const InfoBlock = ({ label, value, field, keyboard = 'default', isMultiline = false, placeholder = '' }) => (
    <View style={styles.infoBlock}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput 
          style={[styles.input, isMultiline && styles.textArea]} 
          value={value?.toString()} 
          placeholder={placeholder}
          placeholderTextColor="#AAA"
          keyboardType={keyboard}
          multiline={isMultiline}
          onChangeText={(val) => updateField(field, val)}
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
            <Text style={styles.avatarText}>{formData.name.charAt(0)}</Text>
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.uName}>{formData.name}</Text>
            <Text style={styles.uGoal}>Target: {formData.goal}</Text>
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
          <View style={styles.sectionHeader}>
            <ShieldAlert size={18} color={colors.red} />
            <Text style={styles.sectionTitle}>Clinical History</Text>
          </View>
          <View style={styles.card}>
            <InfoBlock label="Any Chronic Disease?" value={formData.hasDisease} field="hasDisease" placeholder="Yes/No" />
            {formData.hasDisease.toLowerCase() === 'yes' && (
              <View style={styles.expandedMedical}>
                <InfoBlock label="Disease Name" value={formData.diseaseName} field="diseaseName" />
                <InfoBlock label="Description" value={formData.diseaseDesc} field="diseaseDesc" isMultiline />
                <View style={styles.row}>
                  <InfoBlock label="Severity" value={formData.severity} field="severity" />
                  <InfoBlock label="Since When" value={formData.sinceWhen} field="sinceWhen" />
                </View>
                <InfoBlock label="Primary Doctor" value={formData.doctorName} field="doctorName" />
              </View>
            )}
          </View>
        </View>

        {formData.hasDisease.toLowerCase() === 'yes' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Pill size={18} color={colors.orange} />
              <Text style={styles.sectionTitle}>Current Medication</Text>
            </View>
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: colors.orange }]}>
              <InfoBlock label="Medicine Name" value={formData.medicineName} field="medicineName" />
              <View style={styles.row}>
                <InfoBlock label="Dosage" value={formData.dosage} field="dosage" />
                <InfoBlock label="Frequency" value={formData.frequency} field="frequency" />
              </View>
              <InfoBlock label="Preferred Timing" value={formData.medTime} field="medTime" />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Phone size={18} color={colors.red} />
            <Text style={styles.sectionTitle}>Emergency Response</Text>
          </View>
          <View style={styles.card}>
            <InfoBlock label="Contact Number" value={formData.emergencyContact} field="emergencyContact" keyboard="phone-pad" />
            <InfoBlock label="Relationship" value={formData.relation} field="relation" />
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Medical Profile</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      <View style={{ height: 50 }} />
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
  uGoal: { fontSize: 12, color: '#888', marginTop: 2 },
  editBtnSmall: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F3E5F5' },
  editBtnTextSmall: { fontSize: 12, fontWeight: 'bold' },
  section: { marginHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
  row: { flexDirection: 'row', gap: 15 },
  infoBlock: { flex: 1, marginBottom: 15 },
  label: { color: '#AAA', fontSize: 10, fontWeight: 'bold', marginBottom: 6 },
  value: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, color: '#121212', fontSize: 13, borderWidth: 1, borderColor: '#EEE' },
  textArea: { height: 80, textAlignVertical: 'top' },
  expandedMedical: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15 },
  saveBtn: { backgroundColor: '#6200EE', marginHorizontal: 20, padding: 18, borderRadius: 20, alignItems: 'center', elevation: 4, marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ProfileScreen;
