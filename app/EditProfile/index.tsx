import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config';
import { useAuth } from '@/contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const EditProfileScreen = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        uid: user.uid,
        email: user.email,
      });
      Alert.alert('✅ Saved', 'Your profile was updated successfully.');
    } catch (err) {
      Alert.alert('❌ Error', 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
    }
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#19949B" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  <Ionicons name="arrow-back" size={24} color="#19949B" />
</TouchableOpacity>

      <Text style={styles.title}>📝 Edit Your Profile</Text>
      

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={profile.name}
        onChangeText={(text) => setProfile((p) => ({ ...p, name: text }))}
      />

      <TextInput
        placeholder="Age"
        style={styles.input}
        keyboardType="numeric"
        value={profile.age?.toString()}
        onChangeText={(text) => setProfile((p) => ({ ...p, age: parseInt(text) }))}
      />

      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={profile.gender}
        onValueChange={(value) => setProfile((p) => ({ ...p, gender: value }))}
      >
        <Picker.Item label="Select gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Smoker</Text>
      <Switch
        value={profile.smoker || false}
        onValueChange={(val) => setProfile((p) => ({ ...p, smoker: val }))}
      />

      <Text style={styles.label}>Activity Level (1–5)</Text>
      <TextInput
        placeholder="e.g. 3"
        style={styles.input}
        keyboardType="numeric"
        value={profile.activityLevel?.toString()}
        onChangeText={(text) => setProfile((p) => ({ ...p, activityLevel: parseInt(text) }))}
      />

      <Text style={styles.label}>Health Conditions</Text>
      {[
        { key: 'hasDiabetes', label: 'Diabetes' },
        { key: 'hasBloodPressure', label: 'Blood Pressure' },
        { key: 'hasHeartDisease', label: 'Heart Disease' },
      ].map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text>{label}</Text>
          <Switch
            value={profile[key] || false}
            onValueChange={(val) => setProfile((p) => ({ ...p, [key]: val }))}
          />
        </View>
      ))}

      <TextInput
        placeholder="Medications"
        style={styles.input}
        value={profile.medications}
        onChangeText={(text) => setProfile((p) => ({ ...p, medications: text }))}
      />

      <TextInput
        placeholder="Allergies"
        style={styles.input}
        value={profile.allergies}
        onChangeText={(text) => setProfile((p) => ({ ...p, allergies: text }))}
      />

      <TextInput
        placeholder="Emergency Contact"
        style={styles.input}
        value={profile.emergencyContact}
        onChangeText={(text) => setProfile((p) => ({ ...p, emergencyContact: text }))}
      />

      <Button title={saving ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={saving} />
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 70,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19949B',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
