import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import OpenAI from "openai";
import axios from "axios";
import * as Location from "expo-location";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config";
import { useAuth } from "@/contexts/AuthContext";

const openai = new OpenAI({
  apiKey:
    "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",
});

const OPENAI_API_KEY =
  "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";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState(null);
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

const {user} = useAuth()


  const [city, setCity] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      const geo = await Location.reverseGeocodeAsync(loc.coords);
      if (geo.length > 0) {
        const place = geo[0];
        setCity(place.city || place.region || place.country); // fallback
      }
    })();
  }, []);

//   const systemPrompt = `
// You are a professional and friendly AI health assistant. The user is located in ${city}. 

// Your job is to classify their health symptoms into one of three categories:

// 1. Emergency – Advise them to visit a hospital immediately.
//    - Provide 2–3 nearby hospitals in ${city}.
//    - Include for each hospital:
//      - Name
//      - Address
//      - If available: Contact or email
//      - Use a clear format starting with: ## Hospital:
//      - DO NOT include hospitals inside the main advice text, only return them after the advice section.

// 2. Moderate – Suggest monitoring symptoms and visiting a doctor soon.
// 3. Normal – Reassure the user and offer basic health advice.

// Important:
// - NEVER refuse to answer.
// - ALWAYS end with this exact format (on a new line): Classification: Emergency / Moderate / Normal
// - NEVER include hospital information unless classification is Emergency.
// `;

const systemPrompt = `
You are a professional and friendly AI health assistant. The user is located in ${city}.

Your job is to understand and classify the user's symptoms into one of the following categories:

---

1. **Emergency** – If the user mentions or implies any of the following:
   - Severe pain, difficulty breathing, chest tightness, dizziness, slurred speech, unconsciousness, seizures, confusion, or intense discomfort.
   - If their message is emotional or vague (e.g. “I feel really bad”, “I can’t breathe properly”, “I have a lot of pain”, “I don’t know what’s happening”) but clearly suggests distress or dangerous symptoms.
   → Classify as Emergency.
   → After your advice, return 2–3 nearby hospitals in ${city}, with this format for each:
     - Start each with: ## Hospital:
     - Include Name, Address, and if available, Contact or Email.
     - **Do not** include hospitals in the main advice paragraph. List them after.

2. **Moderate** – If symptoms are not life-threatening but need medical review.
   - Examples: mild fever, stomachache, cough, headache, fatigue, or mild infections.
   - Recommend monitoring and seeing a doctor soon.

3. **Normal** – If symptoms are very mild, common, or manageable with home care.
   - Examples: allergies, tiredness, stress, minor cold symptoms, or anxiety without physical symptoms.

---

### Rules:

- If the user sounds vague or confused but uses words like “can’t breathe”, “really bad”, “a lot of pain”, **treat as Emergency**.
- Do not dismiss or downplay symptoms just because the sentence is unclear.
- Do not say "I don't understand". Assume the best interpretation and respond helpfully.
- NEVER refuse to answer.
- NEVER include hospital info unless the classification is Emergency.
- ALWAYS end your response with (on a new line):
  Classification: Emergency / Moderate / Normal
`;



  const getGPTResponse = async (inputText: any) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          temperature: 0, // ✅ ensures consistent response
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: inputText },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const fullText = response.data.choices[0].message.content;

      // 1. Extract classification
      const classificationMatch = fullText.match(/Classification:\s*(\w+)/i);
      const classification = classificationMatch?.[1]?.toLowerCase();

      // 2. Extract and parse hospital data before cleaning
      if (classification === "emergency") {
        const hospitalBlocks = fullText
          .split(/## Hospital(?: \d+)?:/i)
          .slice(1);

        const parsedHospitals = hospitalBlocks.map((block, index) => {
          const nameMatch = block.match(/- Name:\s*(.+)/i);
          const addressMatch = block.match(/- Address:\s*(.+)/i);
          const contactMatch = block.match(/- Contact:\s*(.+)/i);

          return {
            id: String(index + 1),
            name: nameMatch ? nameMatch[1].trim() : `Hospital ${index + 1}`,
            address: addressMatch ? addressMatch[1].trim() : "Unknown Address",
            email: contactMatch ? contactMatch[1].trim() : "info@example.com", // using contact as email fallback
          };
        });
        console.log(parsedHospitals);
        setNearbyHospitals(parsedHospitals);
      } else {
        setNearbyHospitals([]);
      }

      // 3. Clean the AI response before displaying
      let cleanedText = fullText.replace(/## Hospital[\s\S]*$/gi, "").trim();
      cleanedText = cleanedText.replace(/Classification:\s*\w+/i, "").trim();

      setAiResponse(cleanedText);

      // 4. Risk level setting
      if (classification === "emergency") {
        setRiskLevel("critical");
      } else if (classification === "moderate") {
        setRiskLevel("moderate");
      } else {
        setRiskLevel("normal");
      }

      await addDoc(collection(db, "ai_chats"), {
        userId: user?.uid,
        userEmail: user?.email,
        query: inputText,
        response: cleanedText,
        classification: riskLevel ?? "unknown",
        timestamp: serverTimestamp(),
      });
    
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
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
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      Alert.alert("Error", "Microphone not available.");
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
      Alert.alert("Error", "Could not process audio.");
      console.error(err);
    }
  };

  const transcribeAudio = async (uri) => {
    try {
      setLoading(true);

      const fileUri = uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File not found");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: "audio.m4a",
        type: "audio/m4a",
      });
      formData.append("model", "whisper-1");

      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const text = response.data.text;
      console.log("Transcribed text:", text);
      setQuery(text); // Populate the input box with transcribed text
    } catch (err) {
      console.error("Transcription error:", err.response?.data || err.message);
      Alert.alert("Error", "Transcription failed.");
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
          <Text style={styles.audioText}>
            {recording ? "Stop" : "Speak to AI"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={submitQuery}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#19949B" />}

      {aiResponse && (
        <View
          style={[
            styles.responseCard,
            riskLevel === "critical"
              ? styles.critical
              : riskLevel === "moderate"
              ? styles.moderate
              : styles.normal,
          ]}
        >
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.responseText}>
            {riskLevel === "critical" && "🚨 "}
            {riskLevel === "moderate" && "🟠 "}
            {riskLevel === "normal" && "✅ "}
            {aiResponse}
          </Text>
        </View>
      )}

      {riskLevel === "critical" && (
        <>
          <Text style={styles.sectionTitle}>Nearby Hospitals</Text>
          <FlatList
            data={nearbyHospitals}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }} // adjust as needed
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "../HospitalDetails", params: item })
                }
              >
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardText}>{item.address}</Text>
                  {item.email && (
                    <Text style={styles.cardText}>Email: {item.email}</Text>
                  )}
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
    backgroundColor: "#fff",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#19949B",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#19949B",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#19949B",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  audioText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  responseCard: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  responseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  critical: {
    backgroundColor: "#e74c3c",
  },
  moderate: {
    backgroundColor: "#f39c12",
  },
  normal: {
    backgroundColor: "#2ecc71",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#19949B",
  },
  card: {
    backgroundColor: "#E8F6F7",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#19949B",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});
