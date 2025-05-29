import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const mockHistory = [
  {
    id: '1',
    timestamp: Date.now() - 60000,
    userMessage: 'I have chest pain and feel dizzy.',
    aiResponse: 'You might be experiencing a serious condition. Please visit the nearest hospital.',
    audioUri: null,
  },
  {
    id: '2',
    timestamp: Date.now() - 360000,
    userMessage: 'I have a mild fever since last night.',
    aiResponse: 'It seems like a viral infection. Monitor your symptoms and stay hydrated.',
    audioUri: null,
  },
  {
    id: '3',
    timestamp: Date.now() - 86400000,
    userMessage: 'My throat hurts and I have a runny nose.',
    aiResponse: 'You may have a cold. No emergency, rest and use home remedies.',
    audioUri: null,
  },
];

export default function HistoryScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // Optional: Navigate to chat detail screen
        // navigation.navigate('ChatDetail', { chat: item });
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="chatbubbles-outline" size={20} color="#19949B" />
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <Text numberOfLines={1} style={styles.userText}>
        You: {item.userMessage}
      </Text>
      <Text numberOfLines={1} style={styles.aiText}>
        Cura: {item.aiResponse}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No chat history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    backgroundColor: '#E6F6F7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  userText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19949B',
  },
  aiText: {
    fontSize: 14,
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
