import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);

  const router = useRouter();


  const hospitals = [
    { id: '1', name: 'CityCare Hospital', distance: '2.1 km', email: 'info@citycare.com' },
    { id: '2', name: 'Green Health Clinic', distance: '3.5 km', email: 'contact@greenhealth.org' },
    { id: '3', name: 'Wellness Center', distance: '5.2 km', email: 'support@wellness.com' },
  ];

  const submitQuery = () => {
    if (!query.trim()) return;

    // Simulated decision logic (mocked)
    let response = '';
    let risk = '';

    if (query.includes('chest') || query.includes('dizzy') || query.includes('severe')) {
      response = 'This appears to be a critical issue. Please visit the nearest hospital immediately.';
      risk = 'critical';
    } else if (query.includes('fever') || query.includes('cold') || query.includes('infection')) {
      response = 'It looks like a moderate issue. Monitor symptoms and consult a doctor in a few days.';
      risk = 'moderate';
      Alert.alert('Cura AI Suggestion', 'Monitor your symptoms and consider visiting a doctor after 3-5 days.');
    } else {
      response = 'Everything seems okay. Stay hydrated and take rest. You are doing great!';
      risk = 'normal';
    }

    setAiResponse(response);
    setRiskLevel(risk);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Cura AI</Text>
      <Text style={styles.subtitle}>Your personal AI healthcare agent.</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your symptoms or ask a question..."
        value={query}
        onChangeText={setQuery}
        multiline
      />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.audioButton} onPress={submitQuery}>
          <Ionicons name="mic" size={24} color="#fff" />
          <Text style={styles.audioText}>Speak to AI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={submitQuery}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {aiResponse && (
        <View style={[styles.responseCard, riskLevel === 'critical' ? styles.critical :
          riskLevel === 'moderate' ? styles.moderate : styles.normal]}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.responseText}>{aiResponse}</Text>
        </View>
      )}

      {riskLevel === 'critical' && (
        <>
          <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
          <FlatList
            data={hospitals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
              onPress={() => router.push({ pathname: '../HospitalDetails', params: item })}
            >
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardText}>Distance: {item.distance}</Text>
                <Text style={styles.cardText}>Email: {item.email}</Text>
              </View>
            </TouchableOpacity>
            )}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19949B',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#19949B',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19949B',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  audioText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  responseCard: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  responseText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  critical: {
    backgroundColor: '#e74c3c',
  },
  moderate: {
    backgroundColor: '#f39c12',
  },
  normal: {
    backgroundColor: '#2ecc71',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#19949B',
  },
  card: {
    backgroundColor: '#E8F6F7',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#19949B',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
