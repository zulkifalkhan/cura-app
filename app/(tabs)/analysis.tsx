// app/screens/HealthInsightsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config";
import axios from "axios";
import { useRouter } from "expo-router";

const OPENAI_API_KEY =
  "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";

const HealthInsightsScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [insights, setInsights] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchInsights = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Check for missing profile fields
        const requiredFields = [
          "age",
          "gender",
          "activityLevel",
          "hasDiabetes",
          "hasBloodPressure",
          "hasHeartDisease",
        ];
        const missing = requiredFields.filter(
          (f) => userData[f] === undefined || userData[f] === ""
        );
        setMissingFields(missing);

        // Fetch recent health chats
        const chatQuery = query(
          collection(db, "ai_chats"),
          where("userId", "==", user.uid)
        );
        const chatSnap = await getDocs(chatQuery);
        const chats = chatSnap.docs
          .map((doc) => doc.data())
          .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());

        const chatHistory = chats
          .map((c, i) => `Q${i + 1}: ${c.query}\nA${i + 1}: ${c.response}`)
          .join("\n\n");

        const userProfileText = `
Name: ${userData.name || "Unknown"}
Age: ${userData.age || "N/A"}
Gender: ${userData.gender || "N/A"}
Smoker: ${userData.smoker ? "Yes" : "No"}
Activity Level: ${userData.activityLevel ?? "N/A"}
Has Diabetes: ${userData.hasDiabetes ? "Yes" : "No"}
Has Blood Pressure: ${userData.hasBloodPressure ? "Yes" : "No"}
Has Heart Disease: ${userData.hasHeartDisease ? "Yes" : "No"}
Allergies: ${userData.allergies || "None"}
Medications: ${userData.medications || "None"}
        `.trim();

        const prompt = `
${userProfileText}

Recent Health Conversations:
${chatHistory || "No health conversations found."}

As a professional and friendly AI Health Advisor 🤖❤️, analyze this user's health profile and conversation history. Provide:

1. 🔍 Patterns or recurring issues in symptoms
2. 📝 Personalized advice or suggestions
3. 🛡️ Preventive health tips or early alerts

Use motivational language with emojis where appropriate. Be brief, positive, and never alarming. Encourage the user to complete missing data if profile seems incomplete.
        `.trim();

        const res = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a compassionate AI health advisor providing friendly, practical, and non-alarming advice.",
              },
              { role: "user", content: prompt },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );

        setInsights(res.data.choices[0].message.content.trim());
      } catch (err) {
        console.error("Insight Error:", err);
        setInsights("❌ Could not load insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user?.uid]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧠 Your Health Insights</Text>

      {missingFields.length > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            ⚠️ Your profile is missing important details:
          </Text>
          {missingFields.map((field) => (
            <Text key={field} style={styles.fieldItem}>
              • {field}
            </Text>
          ))}
          <TouchableOpacity onPress={() => ({})}>
            <Text style={styles.editLink}>Edit Profile →</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#19949B" />
      ) : (
        <Text style={styles.insights}>{insights}</Text>
      )}
    </ScrollView>
  );
};

export default HealthInsightsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 100, 
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#19949B",
    marginBottom: 20,
  },
  alertBox: {
    backgroundColor: "#FFF0EB",
    borderLeftWidth: 5,
    borderLeftColor: "#FF6B6B",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  alertText: {
    fontWeight: "600",
    color: "#C44545",
    marginBottom: 6,
  },
  fieldItem: {
    fontSize: 14,
    color: "#C44545",
    marginLeft: 8,
  },
  editLink: {
    marginTop: 10,
    color: "#19949B",
    fontWeight: "600",
  },
  insights: {
    fontSize: 18,
    color: "#333",
    lineHeight: 26,
  },
});
