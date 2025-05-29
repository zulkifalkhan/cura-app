import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';

export default function ProfileScreen() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: () => console.log('Logged out') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. Continue?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle" size={72} color="#19949B" />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.optionList}>
        <ProfileOption
          icon={<Feather name="lock" size={22} color="#19949B" />}
          label="Change Password"
          onPress={() => console.log('Navigate to Change Password')}
        />
        <ProfileOption
          icon={<Feather name="file-text" size={22} color="#19949B" />}
          label="Terms of Service"
          onPress={() => console.log('Show Terms')}
        />
        <ProfileOption
          icon={<MaterialIcons name="privacy-tip" size={22} color="#19949B" />}
          label="Privacy Policy"
          onPress={() => console.log('Show Privacy Policy')}
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
    </View>
  );
}

const ProfileOption = ({ icon, label, onPress, labelStyle = {} }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    {icon}
    <Text style={[styles.optionLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
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
});
