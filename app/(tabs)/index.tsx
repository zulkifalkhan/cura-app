import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [query, setQuery] = useState('');

  const hospitals = [
    { id: '1', name: 'CityCare Hospital', distance: '2.1 km', email: 'info@citycare.com' },
    { id: '2', name: 'Green Health Clinic', distance: '3.5 km', email: 'contact@greenhealth.org' },
    { id: '3', name: 'Wellness Center', distance: '5.2 km', email: 'support@wellness.com' },
  ];

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

      <TouchableOpacity style={styles.audioButton}>
        <Ionicons name="mic" size={28} color="#fff" />
        <Text style={styles.audioText}>Speak to AI</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
      <FlatList
        data={hospitals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>Distance: {item.distance}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19949B',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 10,
  },
  audioText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
