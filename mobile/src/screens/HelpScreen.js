import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { HelpCircle, BookOpen, MessageSquare, ChevronDown, ChevronUp, ShieldCheck, Cpu } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpScreen = () => {
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    { 
      id: 1, 
      q: "How do I sync my smart watch?", 
      a: "Go to the Vitals tab and tap 'Connect & Monitor'. Ensure your device Bluetooth is active and the GymCare sensor is within range." 
    },
    { 
      id: 2, 
      q: "Is my medical data secure?", 
      a: "Yes, all health and clinical data is encrypted locally and only shared with your emergency contacts during a critical alert." 
    },
    { 
      id: 3, 
      q: "What does 'Critical' status mean?", 
      a: "A Critical status is triggered if your Heart Rate or SpO2 exceeds personalized safety thresholds. Please stop exercising and seek medical attention." 
    },
    { 
      id: 4, 
      q: "How is my BMI calculated?", 
      a: "BMI is calculated automatically using your Height and Weight provided in the Profile tab. Formula: Weight(kg) / [Height(m)]²." 
    }
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const HelpCard = ({ icon: Icon, title, desc }) => (
    <View style={styles.helpCard}>
      <View style={styles.cardIcon}>
        <Icon size={20} color="#6200EE" />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Center</Text>
        <Text style={styles.subtitle}>Find answers or contact our team</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Guides</Text>
        <HelpCard icon={Cpu} title="Sensor Integration" desc="How to calibrate your HR and SpO2 sensors." />
        <HelpCard icon={ShieldCheck} title="Data Privacy" desc="Learn how we protect your clinical logs." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq) => (
          <TouchableOpacity 
            key={faq.id} 
            style={styles.faqCard} 
            onPress={() => toggleExpand(faq.id)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              {expandedId === faq.id ? <ChevronUp size={18} color="#6200EE" /> : <ChevronDown size={18} color="#666" />}
            </View>
            {expandedId === faq.id && (
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.supportBox}>
        <MessageSquare size={24} color="#FFF" />
        <View style={styles.supportText}>
          <Text style={styles.supportTitle}>Need more help?</Text>
          <Text style={styles.supportSub}>Contact our 24/7 technical support</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { marginBottom: 30, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#121212' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#AAA', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  helpCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 24, marginBottom: 12, elevation: 2 },
  cardIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#121212' },
  cardDesc: { fontSize: 12, color: '#888', marginTop: 4 },
  faqCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 20, marginBottom: 10, elevation: 1 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  faqAnswer: { fontSize: 13, color: '#666', marginTop: 12, lineHeight: 20, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 10 },
  supportBox: { backgroundColor: '#6200EE', padding: 25, borderRadius: 28, flexDirection: 'row', alignItems: 'center', elevation: 5 },
  supportText: { flex: 1, marginLeft: 15 },
  supportTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  supportSub: { color: '#EDE7F6', fontSize: 11, marginTop: 2 },
  chatBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  chatBtnText: { color: '#6200EE', fontWeight: 'bold', fontSize: 12 }
});

export default HelpScreen;
