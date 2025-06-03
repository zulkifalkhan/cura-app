import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HospitalDetailsScreen() {
  const { name, distance, email } = useLocalSearchParams();

  // Mock phone & address for demo - pass via params if needed
  const phone = '+1 (555) 123-4567';
  const address = '123 Main Street, Your City, Country';

  const sendEmergencyEmail = () => {
    const subject = `Emergency Assistance Required - ${name}`;
    const body = `Hello ${name},\n\nI need urgent medical attention. Please assist immediately.\n\nLocation: ${address}`;
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Failed to open email client');
    });
  };

  const callHospital = () => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Failed to open phone dialer');
    });
  };

  const openMaps = () => {
    const query = encodeURIComponent(address);
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?address=${query}`
        : `geo:0,0?q=${query}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Failed to open map application');
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/images/hospital.jpg')}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={styles.infoBox}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.detail}>Distance: {distance}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {name}</Text>
          <Text style={styles.paragraph}>
            {name} is a leading healthcare facility committed to providing high-quality medical services to the community.
            Our team of dedicated doctors, nurses, and staff work around the clock to ensure patients receive compassionate care.
            Equipped with state-of-the-art technology and specialized departments, we offer a wide range of medical treatments and emergency services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={20} color="#19949B" />
            <Text style={styles.contactText}>{email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={20} color="#19949B" />
            <Text style={styles.contactText}>{phone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity onPress={openMaps} style={styles.mapContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300x180?text=Tap+to+Open+Map' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <Ionicons name="location-sharp" size={30} color="#fff" />
              <Text style={styles.mapOverlayText}>Tap to open in Maps</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.paragraph}>{address}</Text>
        </View>
      </ScrollView>

      {/* Fixed footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={sendEmergencyEmail}>
          <Text style={styles.buttonText}>Send Emergency Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.callButton]} onPress={callHospital}>
          <Text style={styles.buttonText}>Call Hospital</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 140, // Add bottom padding to avoid content under footer
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#E8F6F7',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#19949B',
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  section: {
    width: '100%',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#19949B',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
  mapContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: 300,
    height: 180,
    borderRadius: 12,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(25, 148, 155, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mapOverlayText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'column',  // stack vertically
    alignItems: 'center',     // center horizontally
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',             // 80% width
    alignItems: 'center',
    marginVertical: 7,        // space between buttons
  },
  callButton: {
    backgroundColor: '#19949B',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
