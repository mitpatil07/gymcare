import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Animated, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ChevronRight, ChevronLeft, User, ShieldAlert, Phone, Mail, Lock, Heart, Activity, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

const LoginScreen = ({ colors }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [alertConfig, setAlertConfig] = useState({ show: false, title: '', message: '', isSuccess: false });

  const [formData, setFormData] = useState({
    email: '', password: '', name: '', age: '', gender: 'Male', height: '', weight: '', bloodGroup: '',
    hasDisease: 'No', diseaseName: '', diseaseDesc: '', severity: 'None',
    medicineName: '', dosage: '', frequency: '', medTime: '', emergencyContact: '', relation: ''
  });

  const updateField = (field, val) => setFormData({ ...formData, [field]: val });
  const showAlert = (title, message, isSuccess = false) => setAlertConfig({ show: true, title, message, isSuccess });

  const moveStep = (to) => {
    if (to > step) {
      if (step === 1 && (!formData.email || !formData.password)) return showAlert("Missing Information", "Please enter a valid email and password.");
      if (step === 2 && (!formData.name || !formData.age || !formData.height || !formData.weight)) return showAlert("Incomplete Form", "Please fill in all physical statistics.");
      if (step === 3 && (!formData.hasDisease)) return showAlert("Required", "Please specify if you have any chronic diseases.");
    }
    Animated.timing(slideAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
      setStep(to);
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) return showAlert("Login Failed", "Please enter both email and password.");
    setLoading(true);
    try { await signInWithEmailAndPassword(auth, formData.email, formData.password); } 
    catch (error) { showAlert("Authentication Error", "Invalid credentials. Please try again."); } 
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!formData.emergencyContact) return showAlert("Missing Information", "Emergency contact number is required.");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "users", userCredential.user.uid), { ...formData, uid: userCredential.user.uid });
    } catch (error) { showAlert("Registration Error", error.message); } 
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user already exists in Firestore, if not, create a basic profile
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
          goal: "Basic Member"
        });
      }
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        showAlert("Google Sign-In Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, placeholder, value, field, isPassword = false, keyboard = 'default', half = false }) => {
    const [showPass, setShowPass] = useState(false);
    return (
      <View style={[styles.inputWrapper, half && { flex: 1 }]}>
        <View style={styles.inputIcon}><Icon size={16} color={colors.primary} /></View>
        <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9CA3AF" value={value} secureTextEntry={isPassword && !showPass} keyboardType={keyboard} onChangeText={(v) => updateField(field, v)} autoCapitalize="none" />
        {isPassword && <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 5 }}>{showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}</TouchableOpacity>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={[styles.blob, styles.blob1, { backgroundColor: '#D8B4FE50' }]} />
      <View style={[styles.blob, styles.blob2, { backgroundColor: '#FEF08A50' }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.brandCircle, { backgroundColor: colors.primary }]}><Activity size={32} color="#FFF" /></View>
          <Text style={styles.title}>{isRegistering ? 'Clinical Onboarding' : 'GymCare AI'}</Text>
          <Text style={styles.subtitle}>{isRegistering ? `Onboarding Step ${step}/4` : 'Precision vitals monitoring'}</Text>
        </View>

        <View style={styles.mainCard}>
          {!isRegistering ? (
            <View>
              <InputField icon={Mail} placeholder="Email Address" value={formData.email} field="email" keyboard="email-address" />
              <InputField icon={Lock} placeholder="Secure Password" value={formData.password} field="password" isPassword />
              
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>SIGN IN</Text>}
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} /><Text style={styles.dividerText}>OR</Text><View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} disabled={loading}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={styles.googleIcon} />
                <Text style={styles.googleBtnText}>Sign in with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchLink} onPress={() => setIsRegistering(true)}>
                <Text style={[styles.switchLinkText, { color: colors.primary }]}>Register as New Patient</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.View style={{ opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(step/4)*100}%`, backgroundColor: colors.primary }]} /></View>
              {step === 1 && (<View style={styles.stepContainer}><Text style={styles.stepIntro}>Secure your health data.</Text><InputField icon={Mail} placeholder="Email" value={formData.email} field="email" keyboard="email-address" /><InputField icon={Lock} placeholder="Password" value={formData.password} field="password" isPassword /></View>)}
              {step === 2 && (<View style={styles.stepContainer}><Text style={styles.stepIntro}>Physical stats help us calculate your BMI.</Text><InputField icon={User} placeholder="Full Name" value={formData.name} field="name" /><View style={styles.genderRow}><TouchableOpacity style={[styles.genderBtn, formData.gender === 'Male' && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => updateField('gender', 'Male')}><Text style={[styles.genderText, formData.gender === 'Male' && { color: '#FFF' }]}>👨 Male</Text></TouchableOpacity><TouchableOpacity style={[styles.genderBtn, formData.gender === 'Female' && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => updateField('gender', 'Female')}><Text style={[styles.genderText, formData.gender === 'Female' && { color: '#FFF' }]}>👩 Female</Text></TouchableOpacity></View><View style={styles.row}><InputField half icon={Activity} placeholder="Age" value={formData.age} field="age" keyboard="numeric" /><InputField half icon={Heart} placeholder="Blood" value={formData.bloodGroup} field="bloodGroup" /></View><View style={styles.row}><InputField half icon={Activity} placeholder="Height" value={formData.height} field="height" keyboard="numeric" /><InputField half icon={Activity} placeholder="Weight" value={formData.weight} field="weight" keyboard="numeric" /></View></View>)}
              {step === 3 && (<View style={styles.stepContainer}><Text style={styles.stepIntro}>Declared conditions help set safety thresholds.</Text><InputField icon={ShieldAlert} placeholder="Chronic Disease? (Yes/No)" value={formData.hasDisease} field="hasDisease" />{formData.hasDisease.toLowerCase() === 'yes' && <InputField icon={Activity} placeholder="Disease Name" value={formData.diseaseName} field="diseaseName" />}</View>)}
              {step === 4 && (<View style={styles.stepContainer}><Text style={styles.stepIntro}>Used for instant SOS alerts.</Text><InputField icon={Phone} placeholder="Contact Number" value={formData.emergencyContact} field="emergencyContact" keyboard="phone-pad" /><InputField icon={UserPlus} placeholder="Relation" value={formData.relation} field="relation" /></View>)}
              <View style={styles.footerNav}>
                <TouchableOpacity style={[styles.backBtn, step === 1 && { opacity: 0 }]} onPress={() => step > 1 && moveStep(step - 1)} disabled={step === 1}><ChevronLeft size={18} color="#9CA3AF" /><Text style={styles.backBtnText}>BACK</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={step < 4 ? () => moveStep(step + 1) : handleRegister}>{loading ? <ActivityIndicator color="#FFF" /> : <><Text style={styles.nextBtnText}>{step === 4 ? 'FINISH' : 'NEXT'}</Text><ChevronRight size={18} color="#FFF" /></>}</TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancelLink} onPress={() => setIsRegistering(false)}><Text style={styles.cancelLinkText}>Cancel & Sign In</Text></TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={[styles.insightCard, { backgroundColor: '#F3E5F5' }]}>
          <View style={[styles.insightIconBox, { backgroundColor: '#FFF' }]}><Sparkles size={18} color="#111827" /></View>
          <View style={styles.insightTextContent}>
            <Text style={styles.insightTitle}>Daily Health Insight</Text>
            <Text style={styles.insightBody}>Maintaining a steady Heart Rate within your safe range improves cardiovascular longevity by 15%.</Text>
          </View>
        </View>
      </ScrollView>

      <AwesomeAlert
        show={alertConfig.show}
        showProgress={false} title={alertConfig.title} message={alertConfig.message}
        closeOnTouchOutside={true} closeOnHardwareBackPress={false} showConfirmButton={true}
        confirmText="Got it" confirmButtonColor={alertConfig.isSuccess ? "#10B981" : "#111827"}
        onConfirmPressed={() => setAlertConfig({ ...alertConfig, show: false })}
        titleStyle={{ fontSize: 18, fontWeight: '800', color: '#111827' }} messageStyle={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}
        contentContainerStyle={{ borderRadius: 30, padding: 25 }} confirmButtonStyle={{ paddingHorizontal: 30, borderRadius: 20 }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  blob: { position: 'absolute', borderRadius: 200 },
  blob1: { width: 300, height: 300, top: -50, right: -100 },
  blob2: { width: 250, height: 250, bottom: -50, left: -100 },
  scrollContent: { padding: 15, paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 25 },
  brandCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  mainCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, marginBottom: 15, paddingHorizontal: 15, height: 56 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#111827', fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10, width: '100%' },
  primaryBtn: { height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 5, elevation: 2 },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 10, color: '#9CA3AF', fontWeight: '700', fontSize: 12 },
  googleBtn: { height: 56, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', elevation: 1 },
  googleIcon: { width: 20, height: 20, marginRight: 12 },
  googleBtnText: { color: '#111827', fontSize: 15, fontWeight: '700' },
  switchLink: { alignItems: 'center', marginTop: 25 },
  switchLinkText: { fontWeight: '800', fontSize: 14 },
  progressTrack: { height: 4, backgroundColor: '#F3F4F6', borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  stepContainer: { minHeight: 200 },
  stepIntro: { fontSize: 13, color: '#6B7280', marginBottom: 20, fontWeight: '600' },
  footerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { color: '#9CA3AF', fontWeight: '800', fontSize: 12 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, height: 50, borderRadius: 25, gap: 8, elevation: 3 },
  nextBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  cancelLink: { alignItems: 'center', marginTop: 25 },
  cancelLinkText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  insightCard: { flexDirection: 'row', alignItems: 'center', marginTop: 30, padding: 20, borderRadius: 25, marginBottom: 20 },
  insightIconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  insightTextContent: { flex: 1 },
  insightTitle: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 4 },
  insightBody: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
  genderRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  genderBtn: { flex: 1, height: 50, borderRadius: 15, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  genderText: { fontSize: 14, fontWeight: '700', color: '#6B7280' }
});

export default LoginScreen;
