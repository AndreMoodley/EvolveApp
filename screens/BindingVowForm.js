import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CalendarContext } from '../store/calendar-context';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

function BindingVowForm({ navigation }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const calendarCtx = useContext(CalendarContext);

  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  const addVow = async (type) => {
    if (title.trim() === '' || description.trim() === '' || !date) {
      Alert.alert('Invalid input', 'Please fill in all fields and select a valid date.');
      return;
    }
 
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (selectedDate < currentDate) {
      Alert.alert('Invalid date', 'The date must be in the future.');
      return;
    }

    const minDate = moment().add(2, 'months').toDate();
    const maxDate = moment().add(2, 'months').toDate();

    if (type === 'major' && selectedDate < minDate) {
      Alert.alert('Invalid date', 'Major vows must be set at least 2 months in the future.');
      return;
    }

    if (type === 'minor' && selectedDate > maxDate) {
      Alert.alert('Invalid date', 'Minor vows must be set no more than 2 months in the future.');
      return;
    }

    const vow = {
      title,
      description,
      date: date.toISOString(),
      startDate: new Date().toISOString(),
      type,
    };

    await calendarCtx.addVow(vow);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>Add Binding Vow</Text>
      <TextInput
        style={[styles.input, { borderColor: currentTheme.primary }]}
        placeholder="Title"
        placeholderTextColor={currentTheme.textSecondary}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { borderColor: currentTheme.primary }]}
        placeholder="Description"
        placeholderTextColor={currentTheme.textSecondary}
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.datePickerContainer}>
        <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Select Date</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <Text style={[styles.dateText, { backgroundColor: currentTheme.primaryLight }]}>
            {moment(date).format('YYYY-MM-DD')}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          minimumDate={new Date()}
          maximumDate={moment().add(2, 'years').toDate()}
        />
      </View>
      <Text style={[styles.note, { color: currentTheme.textSecondary }]}>
        Major vows must be set at least 2 months in the future. Minor vows must be set no more than 2 months in the future. Dates cannot be set in the past.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={() => addVow('major')}>
          <Text style={styles.buttonText}>Add Major Vow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={() => addVow('minor')}>
          <Text style={styles.buttonText}>Add Minor Vow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#b22222',
    color: 'white',
  },
  datePickerContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    color: 'white',
  },
  note: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default BindingVowForm;
