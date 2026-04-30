import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>GC</Text>
        </View>
        <Text style={styles.appName}>GymCare</Text>
        <Text style={styles.tagline}>Smart Health Monitoring</Text>
      </View>

      <View style={styles.form}>
        <TextInput 
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginBtn} onPress={onLogin}>
          <Text style={styles.loginBtnText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  logoCircle: { 
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#BB86FC',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15
  },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#000' },
  appName: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  tagline: { color: '#AAA', fontSize: 14, marginTop: 5 },
  form: { width: '100%' },
  input: {
    backgroundColor: '#1E1E1E', color: '#FFF', padding: 15, borderRadius: 12,
    marginBottom: 15, borderWidth: 1, borderColor: '#333', fontSize: 16
  },
  loginBtn: { 
    backgroundColor: '#BB86FC', padding: 18, borderRadius: 12, 
    alignItems: 'center', marginTop: 10 
  },
  loginBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  forgotBtn: { alignItems: 'center', marginTop: 20 },
  forgotText: { color: '#AAA' },
  footer: { 
    flexDirection: 'row', justifyContent: 'center', 
    position: 'absolute', bottom: 40, width: '100%', left: 20
  },
  footerText: { color: '#AAA' },
  signUpText: { color: '#BB86FC', fontWeight: 'bold' }
});

export default LoginScreen;
