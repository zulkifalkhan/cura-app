import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { auth, db } from '@/config';
import { doc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';

const UserOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleFinish = async (finalData: any) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return Alert.alert('Error', 'User not logged in');

    try {
      await updateDoc(doc(db, 'users', uid), {
        ...formData,
        ...finalData,
        onboardingCompleted: true,
      });
      router.push('/(tabs)')
      // Navigate to home/tabs screen here
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  if (step === 1) return <Step1 onContinue={handleNext} />;
  if (step === 2) return <Step2 onContinue={handleNext} />;
  if (step === 3) return <Step3 onFinish={handleFinish} />;
};

export default UserOnboarding;

const YesNoRow = ({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) => (
  <View style={styles.row}>
    {['Yes', 'No'].map(option => {
      const boolVal = option === 'Yes';
      return (
        <TouchableOpacity
          key={option}
          style={[styles.option, value === boolVal && styles.optionSelected]}
          onPress={() => onChange(boolVal)}
        >
          <Text style={value === boolVal ? styles.optionTextSelected : styles.optionText}>
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const OptionRow = ({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}) => (
  <View style={styles.row}>
    {options.map(option => (
      <TouchableOpacity
        key={option}
        style={[styles.option, selected === option && styles.optionSelected]}
        onPress={() => onSelect(option)}
      >
        <Text style={selected === option ? styles.optionTextSelected : styles.optionText}>
          {option}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);



const Step1 = ({ onContinue }: { onContinue: (data: any) => void }) => {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('');
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [activityLevel, setActivityLevel] = useState(3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome to Cura</Text>
      <Text style={styles.subheader}>We use this info to improve recommendations for you.</Text>

      <Text style={styles.label}>Age: {age}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={100}
        value={age}
        onValueChange={val => setAge(Math.round(val))}
      />

      <Text style={styles.label}>Gender</Text>
      <OptionRow options={['Male', 'Female', 'Other']} selected={gender} onSelect={setGender} />

      <Text style={styles.label}>Do you have Diabetes?</Text>
      <YesNoRow value={hasDiabetes} onChange={setHasDiabetes} />

      <Text style={styles.label}>Are you a smoker?</Text>
      <YesNoRow value={smoker} onChange={setSmoker} />

      <Text style={styles.label}>Activity Level: {activityLevel}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={activityLevel}
        onValueChange={setActivityLevel}
      />
      <Text style={styles.helperText}>1 = Sedentary, 5 = Very Active</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          onContinue({ age, gender, hasDiabetes, smoker, activityLevel })
        }
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step2 = ({ onContinue }: { onContinue: (data: any) => void }) => {
  const [hasHeartDisease, setHeartDisease] = useState(false);
  const [hasBloodPressure, setBloodPressure] = useState(false);
  const [medications, setMedications] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Health Details</Text>
      <Text style={styles.subheader}>A few more questions to tailor recommendations.</Text>

      <Text style={styles.label}>Do you have heart disease?</Text>
      <YesNoRow value={hasHeartDisease} onChange={setHeartDisease} />

      <Text style={styles.label}>High blood pressure?</Text>
      <YesNoRow value={hasBloodPressure} onChange={setBloodPressure} />

      <Text style={styles.label}>Any medications?</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional"
        value={medications}
        onChangeText={setMedications}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          onContinue({ hasHeartDisease, hasBloodPressure, medications })
        }
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step3 = ({ onFinish }: { onFinish: (data: any) => void }) => {
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Final Step</Text>
      <Text style={styles.subheader}>One last step to ensure your safety.</Text>

      <Text style={styles.label}>Emergency Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number (optional)"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Any allergies?</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., peanuts, penicillin"
        value={allergies}
        onChangeText={setAllergies}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onFinish({ emergencyContact, allergies })}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    marginTop: '20%', // 👈 This adds 20% vertical space from the top
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#19949B',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  slider: {
    height: 40,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: '#19949B',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: '#19949B',
  },
  optionText: {
    color: '#19949B',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#19949B',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#777',
    marginBottom: 16,
  },
});


export const options = {
  headerShown: false,
};