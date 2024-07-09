import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getFormattedDate } from '../../util/date';
import { useTheme } from '../../store/theme-context';
import { getTheme } from '../../constants/styles';
import { fetchWorkouts } from '../../util/http';

function ExpenseForm({ submitButtonLabel, onSubmit, onCancel, defaultValues }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const [inputs, setInputs] = useState({
    rating: defaultValues ? defaultValues.rating?.toString() : '',
    date: defaultValues ? new Date(defaultValues.date) : new Date(),
    description: defaultValues ? defaultValues.description : '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (defaultValues && defaultValues.id) {
      fetchWorkouts(defaultValues.id).then(fetchedWorkouts => {
        setWorkouts(fetchedWorkouts);
      });
    }
  }, [defaultValues]);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function submitHandler() {
    const rating = parseFloat(inputs.rating);
    if (isNaN(rating) || rating < -1000 || rating > 1000) {
      Alert.alert('Invalid input', 'Rating must be a number between -1000 and 1000.');
      return;
    }

    const expenseData = {
      rating,
      date: inputs.date instanceof Date ? inputs.date.toISOString() : new Date(inputs.date).toISOString(),
      description: inputs.description
    };

    onSubmit(expenseData, workouts);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    inputChangedHandler('date', date); // Store date as Date object
    hideDatePicker();
  };

  const addWorkoutHandler = () => {
    setWorkouts((currentWorkouts) => [
      ...currentWorkouts,
      { id: Date.now().toString(), name: '', reps: '', rpe: '', sets: [] },
    ]); 
  };

  const workoutChangedHandler = (index, field, value) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index][field] = value;
    setWorkouts(updatedWorkouts);
  };

  const addSetHandler = (workoutIndex) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].sets.push({ reps: '', rpe: '' });
    setWorkouts(updatedWorkouts);
  };

  const setChangedHandler = (workoutIndex, setIndex, field, value) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].sets[setIndex][field] = value;
    setWorkouts(updatedWorkouts);
  };

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <Text style={[styles.title, { color: currentTheme.textPrimary }]}>Your Rating</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Rating</Text>
          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
            onChangeText={inputChangedHandler.bind(this, 'rating')}
            value={inputs.rating}
            keyboardType="decimal-pad"
            placeholder="0 - 10"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Date</Text>
          <Pressable onPress={showDatePicker}>
            <Text style={[styles.input, { backgroundColor: currentTheme.primaryLight, fontSize: 16, color: 'white' }]}>
              {getFormattedDate(inputs.date)}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={startOfWeek}
            maximumDate={endOfWeek}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
          onChangeText={inputChangedHandler.bind(this, 'description')}
          value={inputs.description}
          multiline
          placeholderTextColor="white"
        />
      </View>
      <TouchableOpacity style={[styles.addButton, { backgroundColor: currentTheme.primary }]} onPress={addWorkoutHandler}>
        <Text style={styles.buttonText}>Add Workout</Text>
      </TouchableOpacity>
      {workouts.map((workout, workoutIndex) => (
        <View key={workout.id || workoutIndex} style={styles.workoutContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
            placeholder="Workout Name"
            onChangeText={(value) => workoutChangedHandler(workoutIndex, 'name', value)}
            value={workout.name}
            placeholderTextColor="white"
          />
          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
            placeholder="Reps"
            keyboardType="number-pad"
            onChangeText={(value) => workoutChangedHandler(workoutIndex, 'reps', value)}
            value={workout.reps}
            placeholderTextColor="white"
          />
          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
            placeholder="RPE"
            keyboardType="number-pad"
            onChangeText={(value) => workoutChangedHandler(workoutIndex, 'rpe', value)}
            value={workout.rpe}
            placeholderTextColor="white"
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: currentTheme.primary }]} onPress={() => addSetHandler(workoutIndex)}>
            <Text style={styles.buttonText}>Add Set</Text>
          </TouchableOpacity>
          {workout.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.setContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
                placeholder="Reps"
                keyboardType="number-pad"
                onChangeText={(value) => setChangedHandler(workoutIndex, setIndex, 'reps', value)}
                value={set.reps}
                placeholderTextColor="white"
              />
              <TextInput
                style={[styles.input, { backgroundColor: currentTheme.primaryLight, color: 'white' }]}
                placeholder="RPE"
                keyboardType="number-pad"
                onChangeText={(value) => setChangedHandler(workoutIndex, setIndex, 'rpe', value)}
                value={set.rpe}
                placeholderTextColor="white"
              />
            </View>
          ))}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={submitHandler}>
          <Text style={styles.buttonText}>{submitButtonLabel}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    marginVertical: 12,
    padding: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutContainer: {
    marginBottom: 12,
  },
  setContainer: {
    marginLeft: 20,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
 