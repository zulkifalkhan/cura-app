import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function HospitalDetailsScreen() {
  const { name, distance, email } = useLocalSearchParams();

  const phone = '+1 (555) 123-4567';
  const address = '123 Main Street, Your City, Country';

  const [location, setLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Default: Toronto
  const DEFAULT_COORDS = {
    latitude: 43.65107,
    longitude: -79.347015,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setHasLocationPermission(true);
      } catch (err) {
        console.log('Location permission error:', err);
      }
    })();
  }, []);

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

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
  <Ionicons name="chevron-back" size={28} color="#19949B" />
  <Text style={styles.backText}>Back</Text>
</TouchableOpacity>

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
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapView}
              region={location || DEFAULT_COORDS}
              showsUserLocation={hasLocationPermission}
              showsMyLocationButton={true}
            >
              <Marker coordinate={location || DEFAULT_COORDS} title={name} />
            </MapView>
          </View>
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
    paddingBottom: 140,
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
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapView: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
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
    width: '80%',
    alignItems: 'center',
    marginVertical: 7,
  },
  callButton: {
    backgroundColor: '#19949B',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 40,
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: '#19949B',
    fontWeight: '600',
  },
  
});
