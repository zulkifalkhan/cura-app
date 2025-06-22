import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/config';

const formatDateGroup = (timestamp: number) => {
  const now = new Date();
  const date = new Date(timestamp);

  const isToday = now.toDateString() === date.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString();
};

const getSeverity = (classification: string) => {
  if (classification === 'emergency') return 'critical';
  if (classification === 'moderate') return 'mild';
  return 'normal';
};

const severityColors = {
  critical: '#FF4C4C',
  mild: '#FFD166',
  normal: '#06D6A0',
};

const HistoryScreen = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [groupedHistory, setGroupedHistory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'ai_chats'),
      where('userId', '==', user.uid)
      // Removed orderBy to avoid index error
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          timestamp: data.timestamp?.toDate()?.getTime() || Date.now(),
          userMessage: data.query,
          aiResponse: data.response,
          classification: data.classification,
        };
      });
    
      // Sort manually by timestamp desc
      chats.sort((a, b) => b.timestamp - a.timestamp);
      setChatHistory(chats);
    
      // Group by date
      const grouped = chats.reduce((acc, item) => {
        const group = formatDateGroup(item.timestamp);
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
      }, {});
      setGroupedHistory(grouped);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#19949B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>

      <FlatList
        data={Object.keys(groupedHistory)}
        keyExtractor={(item) => item}
        renderItem={({ item: dateGroup }) => (
          <View>
            <Text style={styles.dateGroup}>{dateGroup}</Text>
            {groupedHistory[dateGroup].map((chatItem) => {
              const severity = getSeverity(chatItem.classification);
              return (
                <TouchableOpacity key={chatItem.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Ionicons name="chatbubbles-outline" size={20} color="#19949B" />
                    <Text style={styles.time}>
                      {new Date(chatItem.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={styles.userText}>
                    Symptom: {chatItem.userMessage}
                  </Text>
                  <Text style={styles.aiText}>Cura: {chatItem.aiResponse}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: severityColors[severity] },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {severity === 'critical'
                        ? 'Critical'
                        : severity === 'mild'
                        ? 'Monitor'
                        : 'Normal'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#19949B',
    marginBottom: 10,
  },
  dateGroup: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  card: {
    backgroundColor: '#E6F6F7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19949B',
    marginBottom: 2,
  },
  aiText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
