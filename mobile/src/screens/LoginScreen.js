import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ChevronRight, ChevronLeft, User, ShieldAlert, Phone, Mail, Lock, Heart, Activity, UserPlus, Info } from 'lucide-react-native';

const LoginScreen = ({ colors }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState({
    email: '', password: '',
    name: '', age: '', gender: 'Male', height: '', weight: '', bloodGroup: '',
    hasDisease: 'No', diseaseName: '', diseaseDesc: '', severity: 'None',
    medicineName: '', dosage: '', frequency: '', medTime: '',
    emergencyContact: '', relation: ''
  });

  const updateField = (field, val) => setFormData({ ...formData, [field]: val });

  const moveStep = (to) => {
    Animated.timing(slideAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
      setStep(to);
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...formData, uid: userCredential.user.uid,
        workoutType: 'General', duration: '0 mins', calories: '0', steps: '0', bodyTemp: 98.6
      });
      Alert.alert("Welcome!", "Clinical profile established.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, placeholder, value, field, secure = false, keyboard = 'default', half = false }) => (
    <View style={[styles.inputWrapper, half && { flex: 1 }]}>
      <View style={styles.inputIcon}><Icon size={16} color="#6200EE" /></View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        value={value}
        secureTextEntry={secure}
        keyboardType={keyboard}
        onChangeText={(v) => updateField(field, v)}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Decorative Background Blobs */}
      <View style={[styles.blob, styles.blob1, { backgroundColor: colors.primary + '10' }]} />
      <View style={[styles.blob, styles.blob2, { backgroundColor: colors.primary + '05' }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.brandCircle, { backgroundColor: colors.primary }]}>
            <Activity size={32} color="#FFF" />
          </View>
          <Text style={styles.title}>{isRegistering ? 'Clinical Onboarding' : 'GymCare AI'}</Text>
          <Text style={styles.subtitle}>{isRegistering ? `Onboarding Step ${step}/4` : 'Precision vitals monitoring'}</Text>
        </View>

        <View style={styles.mainCard}>
          {!isRegistering ? (
            <View>
              <InputField icon={Mail} placeholder="Email Address" value={formData.email} field="email" keyboard="email-address" />
              <InputField icon={Lock} placeholder="Secure Password" value={formData.password} field="password" secure />
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={() => signInWithEmailAndPassword(auth, formData.email, formData.password).catch(e => Alert.alert("Error", e.message))}>
                <Text style={styles.primaryBtnText}>SIGN IN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.switchLink} onPress={() => setIsRegistering(true)}>
                <Text style={[styles.switchLinkText, { color: colors.primary }]}>Register as New Patient</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.View style={{ opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(step/4)*100}%`, backgroundColor: colors.primary }]} />
              </View>

              {step === 1 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepIntro}>Secure your health data with a clinical account.</Text>
                  <InputField icon={Mail} placeholder="Email" value={formData.email} field="email" keyboard="email-address" />
                  <InputField icon={Lock} placeholder="Password" value={formData.password} field="password" secure />
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepIntro}>Physical stats help us calculate your BMI and HR range.</Text>
                  <InputField icon={User} placeholder="Full Name" value={formData.name} field="name" />
                  <View style={styles.row}><InputField half icon={Activity} placeholder="Age" value={formData.age} field="age" keyboard="numeric" /><InputField half icon={Heart} placeholder="Blood" value={formData.bloodGroup} field="bloodGroup" /></View>
                  <View style={styles.row}><InputField half icon={Activity} placeholder="Height" value={formData.height} field="height" keyboard="numeric" /><InputField half icon={Activity} placeholder="Weight" value={formData.weight} field="weight" keyboard="numeric" /></View>
                </View>
              )}

              {step === 3 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepIntro}>Declared conditions help us set safety thresholds.</Text>
                  <InputField icon={ShieldAlert} placeholder="Chronic Disease? (Yes/No)" value={formData.hasDisease} field="hasDisease" />
                  {formData.hasDisease.toLowerCase() === 'yes' && <InputField icon={Activity} placeholder="Disease Name" value={formData.diseaseName} field="diseaseName" />}
                </View>
              )}

              {step === 4 && (
                <View style={styles.stepContainer}>
                  <Text style={styles.stepIntro}>Used for instant SOS alerts in critical moments.</Text>
                  <InputField icon={Phone} placeholder="Contact Number" value={formData.emergencyContact} field="emergencyContact" keyboard="phone-pad" />
                  <InputField icon={UserPlus} placeholder="Relation" value={formData.relation} field="relation" />
                </View>
              )}

              <View style={styles.footerNav}>
                <TouchableOpacity style={[styles.backBtn, step === 1 && { opacity: 0 }]} onPress={() => step > 1 && moveStep(step - 1)} disabled={step === 1}>
                  <ChevronLeft size={18} color="#888" /><Text style={styles.backBtnText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={step < 4 ? () => moveStep(step + 1) : handleRegister}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <><Text style={styles.nextBtnText}>{step === 4 ? 'FINISH' : 'NEXT'}</Text><ChevronRight size={18} color="#FFF" /></>}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancelLink} onPress={() => setIsRegistering(false)}><Text style={styles.cancelLinkText}>Cancel & Sign In</Text></TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Space Filler: Health Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightIcon}><Info size={16} color="#6200EE" /></View>
          <View style={styles.insightTextContent}>
            <Text style={styles.insightTitle}>Daily Health Insight</Text>
            <Text style={styles.insightBody}>Maintaining a steady Heart Rate within your safe range improves cardiovascular longevity by 15%.</Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  blob: { position: 'absolute', borderRadius: 200 },
  blob1: { width: 300, height: 300, top: -50, right: -100 },
  blob2: { width: 250, height: 250, bottom: -50, left: -100 },
  scrollContent: { padding: 15, paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 25 },
  brandCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 6 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 12, color: '#777', marginTop: 4 },
  mainCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, marginBottom: 12, paddingHorizontal: 12, height: 54, borderWidth: 1, borderColor: '#EEE' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#1A1A1A', fontSize: 14, fontWeight: '500' },
  row: { flexDirection: 'row', gap: 10, width: '100%' },
  primaryBtn: { height: 54, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4 },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  switchLink: { alignItems: 'center', marginTop: 20 },
  switchLinkText: { fontWeight: 'bold', fontSize: 13 },
  progressTrack: { height: 3, backgroundColor: '#EEE', borderRadius: 2, marginBottom: 15, overflow: 'hidden' },
  progressFill: { height: '100%' },
  stepContainer: { minHeight: 200 },
  stepIntro: { fontSize: 12, color: '#666', marginBottom: 20, fontStyle: 'italic', lineHeight: 18 },
  footerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { color: '#888', fontWeight: 'bold', fontSize: 11 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 46, borderRadius: 12, gap: 8, elevation: 3 },
  nextBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  cancelLink: { alignItems: 'center', marginTop: 20 },
  cancelLinkText: { color: '#AAA', fontSize: 12, fontWeight: '500' },
  insightCard: { flexDirection: 'row', backgroundColor: '#FFF', marginTop: 30, padding: 15, borderRadius: 18, borderLeftWidth: 4, borderLeftColor: '#6200EE', elevation: 3, marginBottom: 20 },
  insightIcon: { marginRight: 12, marginTop: 2 },
  insightTextContent: { flex: 1 },
  insightTitle: { fontSize: 13, fontWeight: 'bold', color: '#1A1A1A' },
  insightBody: { fontSize: 11, color: '#777', marginTop: 4, lineHeight: 16 }
});

export default LoginScreen;
