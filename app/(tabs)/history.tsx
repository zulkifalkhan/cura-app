import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Helper to group by date
const formatDateGroup = (timestamp: number) => {
  const now = new Date();
  const date = new Date(timestamp);

  const isToday =
    now.toDateString() === date.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString();
};

const getSeverity = (text: string) => {
  if (text.toLowerCase().includes('serious') || text.includes('hospital')) return 'critical';
  if (text.toLowerCase().includes('monitor') || text.includes('hydrated')) return 'mild';
  return 'normal';
};

const severityColors = {
  critical: '#FF4C4C',
  mild: '#FFD166',
  normal: '#06D6A0',
};

// Mock data
const mockHistory = [
  {
    id: '1',
    timestamp: Date.now() - 60000,
    userMessage: 'I have chest pain and feel dizzy.',
    aiResponse:
      'You might be experiencing a serious condition. Please visit the nearest hospital.',
  },
  {
    id: '2',
    timestamp: Date.now() - 360000,
    userMessage: 'I have a mild fever since last night.',
    aiResponse:
      'It seems like a viral infection. Monitor your symptoms and stay hydrated.',
  },
  {
    id: '3',
    timestamp: Date.now() - 86400000,
    userMessage: 'My throat hurts and I have a runny nose.',
    aiResponse:
      'You may have a cold. No emergency, rest and use home remedies.',
  },
];

// Group by date
const groupedHistory = mockHistory.reduce((acc, item) => {
  const group = formatDateGroup(item.timestamp);
  acc[group] = acc[group] || [];
  acc[group].push(item);
  return acc;
}, {} as Record<string, typeof mockHistory>);

const HistoryScreen = () => {
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
              const severity = getSeverity(chatItem.aiResponse);
              return (
                <TouchableOpacity
                  key={chatItem.id}
                  style={styles.card}
                  onPress={() => {}}
                >
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
    fontSize: 14,
    fontWeight: '600',
    color: '#19949B',
    marginBottom: 2,
  },
  aiText: {
    fontSize: 14,
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
