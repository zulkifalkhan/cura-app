import React, { useState, useRef, useEffect } from 'react';
import {
  Text, View, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, FlatList, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import OpenAI from 'openai';
import axios from 'axios'
import * as Location from 'expo-location';

const openai = new OpenAI({
  apiKey: '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'
});

const OPENAI_API_KEY = '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'


export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState(null);
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [city, setCity] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
  
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
  
      const geo = await Location.reverseGeocodeAsync(loc.coords);
      if (geo.length > 0) {
        const place = geo[0];
        setCity(place.city || place.region || place.country); // fallback
      }
    })();
  }, []);

  const systemPrompt = `
You are a professional and friendly AI health assistant. The user is located in ${city}. 

Your job is to classify their health symptoms into one of three categories:

1. Emergency – Advise them to visit a hospital immediately.
   - Provide 2–3 nearby hospitals in ${city}.
   - Include for each hospital:
     - Name
     - Address
     - If available: Contact or email
     - Use a clear format starting with: ## Hospital:
     - DO NOT include hospitals inside the main advice text, only return them after the advice section.

2. Moderate – Suggest monitoring symptoms and visiting a doctor soon.
3. Normal – Reassure the user and offer basic health advice.

Important:
- NEVER refuse to answer.
- ALWAYS end with this exact format (on a new line): Classification: Emergency / Moderate / Normal
- NEVER include hospital information unless classification is Emergency.
`;


 
  


const getGPTResponse = async (inputText: any) => {
  try {
    setLoading(true);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: inputText },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    let text = response.data.choices[0].message.content;
    console.log('GPT Raw Response:', text);

    // Extract classification
    const classificationMatch = text.match(/Classification:\s*(\w+)/i);
    const classification = classificationMatch?.[1]?.toLowerCase();

    // Remove Classification line and hospitals from main response
    text = text.replace(/Classification:\s*\w+/i, '').trim();
    text = text.replace(/## Hospital:[\s\S]*/gi, '').trim(); // remove hospitals from main response

    setAiResponse(text);

    if (classification === 'emergency') {
      setRiskLevel('critical');
    } else if (classification === 'moderate') {
      setRiskLevel('moderate');
      // Alert.alert('🟠 Cura AI Suggestion', 'Monitor your symptoms and consider visiting a doctor after 3-5 days.');
    } else {
      setRiskLevel('normal');
    }

    // Parse hospitals
    if (classification === 'emergency') {
      const hospitalsRaw = response.data.choices[0].message.content;
      const hospitalBlocks = hospitalsRaw.split('## Hospital:').slice(1); // remove first element

      const parsedHospitals = hospitalBlocks.map((block, index) => {
        const lines = block.trim().split('\n').map(line => line.trim());
        return {
          id: String(index + 1),
          name: lines[0] || `Hospital ${index + 1}`,
          address: lines[1] || 'Unknown Address',
          email: lines.find(l => l.includes('@')) || 'info@example.com',
        };
      });

      console.log('Nearby Hospitals:', parsedHospitals);
      setNearbyHospitals(parsedHospitals);
    } else {
      setNearbyHospitals([]); // clear hospital list if not emergency
    }

  } catch (err) {
    Alert.alert('Error', 'Something went wrong');
    console.error(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


  const submitQuery = async () => {
    if (!query.trim()) return;
    await getGPTResponse(query);
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      Alert.alert('Error', 'Microphone not available.');
      console.error(err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecording(null);
      await transcribeAudio(uri);
    } catch (err) {
      Alert.alert('Error', 'Could not process audio.');
      console.error(err);
    }
  };

  const transcribeAudio = async (uri) => {
    try {
      setLoading(true);
      const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      const audioBlob = new Blob([Buffer.from(file, 'base64')], { type: 'audio/m4a' });

      const transcription = await openai.createTranscription(
        audioBlob,
        'whisper-1'
      );

      const text = transcription.data.text;
      setQuery(text);
      await getGPTResponse(text);
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity
          style={styles.audioButton}
          onPress={recording ? stopRecording : startRecording}
        >
          <Ionicons name={recording ? "stop" : "mic"} size={24} color="#fff" />
          <Text style={styles.audioText}>{recording ? 'Stop' : 'Speak to AI'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={submitQuery}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>


      {loading && <ActivityIndicator size="large" color="#19949B" />}

      {aiResponse && (
  <View style={[styles.responseCard,
    riskLevel === 'critical' ? styles.critical :
      riskLevel === 'moderate' ? styles.moderate : styles.normal]}>
    <Ionicons name="heart" size={20} color="#fff" />
    <Text style={styles.responseText}>
      {riskLevel === 'critical' && '🚨 '}
      {riskLevel === 'moderate' && '🟠 '}
      {riskLevel === 'normal' && '✅ '}
      {aiResponse}
    </Text>
  </View>
)}

      {riskLevel === 'critical' && (
        <>
          <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
          <FlatList
  data={nearbyHospitals}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '../HospitalDetails', params: item })}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>{item.address}</Text>
        {item.email && <Text style={styles.cardText}>Email: {item.email}</Text>}
      </View>
    </TouchableOpacity>
  )}
/>

        </>
      )}
    </ScrollView>
  );
}

// Keep the same styles from your original code


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
    fontSize: 16,
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
