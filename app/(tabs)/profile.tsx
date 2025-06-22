import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView,
} from 'react-native';
import {
  Ionicons, MaterialIcons, Feather, FontAwesome5,
} from '@expo/vector-icons';
import { logout, deleteAccount, changePassword } from '@/services/AuthService';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const {user} = useAuth()

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: async () => await logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. Continue?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAccount();
            Alert.alert('Account deleted');
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully');
      setShowChangePassword(false);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle" size={72} color="#19949B" />
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.optionList}>
      <ProfileOption
  icon={<Feather name="edit-3" size={22} color="#19949B" />}
  label="Edit Profile"
  onPress={() => router.push('/EditProfile')}
/>

        <ProfileOption
          icon={<Feather name="lock" size={22} color="#19949B" />}
          label="Change Password"
          onPress={() => setShowChangePassword(true)}
        />
        <ProfileOption
          icon={<Feather name="file-text" size={22} color="#19949B" />}
          label="Terms of Service"
          onPress={() => setShowTerms(true)}
        />
        <ProfileOption
          icon={<MaterialIcons name="privacy-tip" size={22} color="#19949B" />}
          label="Privacy Policy"
          onPress={() => setShowPrivacy(true)}
        />
        <ProfileOption
          icon={<Ionicons name="log-out-outline" size={22} color="#19949B" />}
          label="Log Out"
          onPress={handleLogout}
        />
        <ProfileOption
          icon={<FontAwesome5 name="trash" size={22} color="#FF4C4C" />}
          label="Delete Account"
          labelStyle={{ color: '#FF4C4C' }}
          onPress={handleDeleteAccount}
        />
      </View>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowChangePassword(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
      {/* Privacy Policy Modal */}
      <PrivacyModal visible={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </ScrollView>
  );
}

const ProfileOption = ({ icon, label, onPress, labelStyle = {} }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    {icon}
    <Text style={[styles.optionLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const TermsModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalBoxScroll}>
        <ScrollView>
          <Text style={styles.modalTitle}>Terms of Service</Text>
          <Text style={styles.paragraph}>
            • You must be 18+ or have guardian permission to use Cura.{'\n'}
            • You agree not to misuse emergency health services.{'\n'}
            • Data shared with AI is private but not a replacement for professional medical advice.{'\n'}
            • You accept possible limitations in AI-generated recommendations.
          </Text>
        </ScrollView>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancel}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const PrivacyModal = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalBoxScroll}>
        <ScrollView>
          <Text style={styles.modalTitle}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            • We value your privacy. Data is stored securely and never sold.{'\n'}
            • Your health data is only used to personalize care via AI.{'\n'}
            • You can request data deletion at any time.{'\n'}
            • Location and emergency info is encrypted.
          </Text>
        </ScrollView>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancel}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#19949B',
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  optionList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  modalBoxScroll: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19949B',
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#19949B',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancel: {
    color: '#19949B',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
});
