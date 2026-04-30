import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Animated, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { Camera, ChevronLeft, Edit2, LogOut, Check } from 'lucide-react-native';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProfileScreen = ({ user, colors, navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [alertConfig, setAlertConfig] = useState({ show: false, title: '', message: '', isSuccess: false });
  const showAlert = (title, message, isSuccess = false) => setAlertConfig({ show: true, title, message, isSuccess });

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    if (user) setFormData({
      ...user, 
      email: user.email || auth.currentUser?.email || '',
      mobile: user.mobile || user.emergencyContact || ''
    });
  }, [user]);

  const toggleEditing = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, formData, { merge: true });
      toggleEditing();
      showAlert("Success", "Your profile has been updated.", true);
    } catch (error) {
      showAlert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const InfoBlock = ({ label, value, field, keyboard = 'default' }) => (
    <View style={styles.infoBlock}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={value?.toString()} keyboardType={keyboard} onChangeText={(val) => setFormData({...formData, [field]: val})} />
      ) : (
        <Text style={styles.value}>{value || '--'}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      
      {/* Top Navigation */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={18} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleBtn, isEditing && { backgroundColor: '#111827' }]} onPress={isEditing ? handleSave : toggleEditing}>
          {saving ? <ActivityIndicator size="small" color="#FFF" /> : isEditing ? <Check size={18} color="#FFF" /> : <Edit2 size={18} color="#111827" />}
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: `https://api.dicebear.com/7.x/personas/png?seed=${formData?.name || 'User'}&backgroundColor=d8b4fe${formData?.gender === 'Female' ? '&hair=long' : '&hair=short'}` }} 
              style={[styles.avatar, { backgroundColor: colors.purple }]} 
            />
          </View>
          <Text style={styles.uName}>{formData?.name || 'User'}</Text>
          <Text style={styles.uGoal}>Basic Member</Text>
        </View>

        {/* Personal Info */}
        <View style={[styles.pastelCard, { backgroundColor: colors.blue }]}>
          <Text style={styles.cardSectionTitle}>Personal Info</Text>
          <InfoBlock label="Full Name" value={formData?.name} field="name" />
          <InfoBlock label="Email Address" value={formData?.email} field="email" keyboard="email-address" />
          <InfoBlock label="Mobile Number" value={formData?.mobile} field="mobile" keyboard="phone-pad" />
          <InfoBlock label="Gender" value={formData?.gender} field="gender" />
        </View>

        {/* Physical Stats */}
        <View style={[styles.pastelCard, { backgroundColor: colors.green }]}>
          <Text style={styles.cardSectionTitle}>Physical Stats</Text>
          <View style={styles.row}>
            <InfoBlock label="Height (cm)" value={formData?.height} field="height" keyboard="numeric" />
            <InfoBlock label="Weight (kg)" value={formData?.weight} field="weight" keyboard="numeric" />
            <InfoBlock label="Blood Group" value={formData?.bloodGroup} field="bloodGroup" />
          </View>
        </View>

        {/* Medical Data */}
        <View style={[styles.pastelCard, { backgroundColor: colors.yellow }]}>
          <Text style={styles.cardSectionTitle}>Medical Data</Text>
          <InfoBlock label="Chronic Disease" value={formData?.hasDisease} field="hasDisease" />
          {formData?.hasDisease?.toLowerCase() === 'yes' && (
            <InfoBlock label="Disease Name" value={formData?.diseaseName} field="diseaseName" />
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </Animated.View>
      <View style={{ height: 100 }} />

      <AwesomeAlert
        show={alertConfig.show}
        showProgress={false} title={alertConfig.title} message={alertConfig.message}
        closeOnTouchOutside={true} closeOnHardwareBackPress={false} showConfirmButton={true}
        confirmText="Got it" confirmButtonColor={alertConfig.isSuccess ? "#10B981" : "#111827"}
        onConfirmPressed={() => setAlertConfig({ ...alertConfig, show: false })}
        titleStyle={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }} messageStyle={{ fontSize: 13, color: '#6B7280', textAlign: 'center' }}
        contentContainerStyle={{ borderRadius: 24, padding: 20 }} confirmButtonStyle={{ paddingHorizontal: 20, borderRadius: 16 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  circleBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  profileHeader: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  avatarText: { color: '#111827', fontSize: 32, fontWeight: '900' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F9FAFB' },
  uName: { fontSize: 24, fontWeight: '900', color: '#111827' },
  uGoal: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginTop: 4 },
  pastelCard: { marginHorizontal: 20, padding: 20, borderRadius: 24, marginBottom: 15 },
  cardSectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 15 },
  row: { flexDirection: 'row', gap: 10 },
  infoBlock: { flex: 1, marginBottom: 12 },
  label: { color: 'rgba(0,0,0,0.5)', fontSize: 10, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  value: { fontSize: 14, fontWeight: '800', color: '#111827' },
  input: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: 10, color: '#111827', fontSize: 13, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, padding: 16, borderRadius: 24, backgroundColor: '#FEF2F2', marginTop: 5 },
  logoutText: { fontWeight: '800', fontSize: 14, color: '#EF4444' }
});

export default ProfileScreen;
