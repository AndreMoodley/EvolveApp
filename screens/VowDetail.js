import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { getFormattedDate } from '../util/date';
import moment from 'moment';
import { CalendarContext } from '../store/calendar-context';

function VowDetail({ route }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const { vow } = route.params;
  const {
    progressions,
    addProgression,
    completeProgression,
    undoCompletion,
    loadProgressions,
  } = useContext(CalendarContext);
  const [newProgression, setNewProgression] = useState('');

  useEffect(() => {
    loadProgressions(vow.id);
  }, []);

  const currentProgressions = progressions[vow.id] || [];
  const completedProgressions = progressions[`${vow.id}_completed`] || [];

  const handleAddProgression = async () => {
    if (newProgression.trim() === '') {
      return;
    }

    await addProgression(vow.id, { text: newProgression, completed: false });
    setNewProgression('');
  };

  const handleCompleteProgression = () => {
    Alert.alert(
      "Complete Progression",
      "Are you sure you want to complete this progression?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => completeProgression(vow.id) }
      ]
    );
  };

  const handleUndoCompletion = () => {
    Alert.alert(
      "Undo Completion",
      "Are you sure you want to undo this progression completion?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => undoCompletion(vow.id) }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.vowDetails}>
        <Text style={[styles.vowTitle, { color: currentTheme.textPrimary }]}>{vow.title}</Text>
        <Text style={[styles.vowDescription, { color: currentTheme.textPrimary }]}>{vow.description}</Text>
        <Text style={[styles.vowDate, { color: currentTheme.textSecondary }]}>
          {getFormattedDate(vow.startDate)} - {getFormattedDate(vow.date)}
        </Text>
        <Text style={[styles.countdown, { color: currentTheme.textPrimary }]}>
          {moment(vow.date).diff(moment(), 'days') + 1} days left
        </Text>
      </View>
      <View style={styles.progressionContainer}>
        <TextInput
          style={[styles.input, { borderColor: currentTheme.primary }]}
          placeholder="Add Progression"
          placeholderTextColor={currentTheme.textSecondary}
          value={newProgression}
          onChangeText={setNewProgression}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: currentTheme.primary }]} onPress={handleAddProgression}>
          <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>Add Progression</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>Progressions</Text>
        {currentProgressions.map((progression, index) => (
          <View
            key={index}
            style={[styles.progressionItem, { backgroundColor: currentTheme.primary }]}
          >
            <Text style={[styles.progressionText, { color: currentTheme.textPrimary }]}>
              {progression.text}
            </Text>
          </View>
        ))}
        {currentProgressions.length > 0 && (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: currentTheme.primary }]}
            onPress={handleCompleteProgression}
          >
            <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>Complete Last Progression</Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>Completed Progressions</Text>
        {completedProgressions.map((progression, index) => (
          <View
            key={index}
            style={[styles.progressionItem, { backgroundColor: currentTheme.primaryLight }]}
          >
            <Text style={[styles.progressionText, { color: currentTheme.textSecondary }]}>
              {progression.text} - Completed - {getFormattedDate(progression.completedDate)}
            </Text>
          </View>
        ))}
        {completedProgressions.length > 0 && (
          <TouchableOpacity
            style={[styles.undoButton, { backgroundColor: currentTheme.primary }]}
            onPress={handleUndoCompletion}
          >
            <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>Undo Last Completion</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.note, { color: currentTheme.textSecondary }]}>
        Major vows must be set at least 2 months in the future. Minor vows must be set no more than 2 months in the future. Dates cannot be set in the past.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  vowDetails: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vowTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vowDescription: {
    fontSize: 18,
    marginBottom: 8,
  },
  vowDate: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  countdown: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#b22222',
    color: 'white',
    marginRight: 8,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  undoButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  progressionItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  progressionText: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default VowDetail;
