import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Search, ChevronDown, ChevronUp, ShieldCheck, Cpu, MessageSquare } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpScreen = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { id: 1, q: "How do I sync my smart watch?", a: "Go to the Vitals tab and tap 'Connect & Monitor'. Ensure your device Bluetooth is active and the GymCare sensor is within range." },
    { id: 2, q: "Is my medical data secure?", a: "Yes, all health and clinical data is encrypted locally and only shared with your emergency contacts during a critical alert." },
    { id: 3, q: "What does 'Critical' status mean?", a: "A Critical status is triggered if your Heart Rate or SpO2 exceeds personalized safety thresholds. Please stop exercising and seek medical attention." },
    { id: 4, q: "How is my BMI calculated?", a: "BMI is calculated automatically using your Height and Weight provided in the Profile tab." }
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const HelpCard = ({ icon: Icon, title, desc, color }) => (
    <View style={[styles.helpCard, { backgroundColor: color }]}>
      <View style={styles.cardIcon}><Icon size={20} color="#111827" /></View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <Text style={styles.title}>Support Center</Text>
        <Text style={styles.subtitle}>Find answers or contact our team</Text>
        
        <View style={styles.searchBar}>
          <Search size={18} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for help..." 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Guides</Text>
        <HelpCard icon={Cpu} title="Sensor Integration" desc="How to calibrate your HR and SpO2 sensors." color="#D8B4FE" />
        <HelpCard icon={ShieldCheck} title="Data Privacy" desc="Learn how we protect your clinical logs." color="#BAE6FD" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.filter(faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
          faqs.filter(faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase())).map((faq) => (
            <TouchableOpacity key={faq.id} style={styles.faqCard} onPress={() => toggleExpand(faq.id)} activeOpacity={0.7}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                {expandedId === faq.id ? <ChevronUp size={18} color="#111827" /> : <ChevronDown size={18} color="#9CA3AF" />}
              </View>
              {expandedId === faq.id && <Text style={styles.faqAnswer}>{faq.a}</Text>}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResults}><Text style={styles.noResultsText}>No results matching "{searchQuery}"</Text></View>
        )}
      </View>

      <View style={[styles.supportBox, { backgroundColor: '#111827' }]}>
        <MessageSquare size={24} color="#FFF" />
        <View style={styles.supportText}>
          <Text style={styles.supportTitle}>Need more help?</Text>
          <Text style={styles.supportSub}>Contact our 24/7 technical support</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20 },
  header: { marginBottom: 25, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 15, marginTop: 20, height: 50, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#111827', fontWeight: '600' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  helpCard: { flexDirection: 'row', padding: 20, borderRadius: 24, marginBottom: 12 },
  cardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardText: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  cardDesc: { fontSize: 12, color: 'rgba(0,0,0,0.6)', marginTop: 4, fontWeight: '500' },
  faqCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, marginBottom: 10, elevation: 1 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '800', color: '#111827', flex: 1, marginRight: 10 },
  faqAnswer: { fontSize: 13, color: '#6B7280', marginTop: 12, lineHeight: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, fontWeight: '500' },
  supportBox: { padding: 25, borderRadius: 28, flexDirection: 'row', alignItems: 'center', elevation: 5 },
  supportText: { flex: 1, marginLeft: 15 },
  supportTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  supportSub: { color: '#9CA3AF', fontSize: 11, marginTop: 2, fontWeight: '500' },
  chatBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 16 },
  chatBtnText: { color: '#111827', fontWeight: '800', fontSize: 12 },
  noResults: { padding: 30, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E5E7EB' },
  noResultsText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' }
});

export default HelpScreen;
