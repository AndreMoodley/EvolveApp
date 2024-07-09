import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { CalendarContext } from '../store/calendar-context';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { getFormattedDate } from '../util/date';
import moment from 'moment';

function BindingVow({ navigation }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const calendarCtx = useContext(CalendarContext);
 
  const renderVowItem = (item) => {
    const daysLeft = Math.ceil((new Date(item.date) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <View key={item.id} style={[styles.vowItem, { backgroundColor: currentTheme.primary }]}>
        <Text style={[styles.vowTitle, { color: currentTheme.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.vowDescription, { color: currentTheme.textPrimary }]}>{item.description}</Text>
        <Text style={[styles.vowDate, { color: currentTheme.textSecondary }]}>
          {getFormattedDate(item.startDate)} - {getFormattedDate(item.date)}
        </Text>
        <Text style={[styles.countdown, { color: currentTheme.textPrimary }]}>
          {daysLeft} days left
        </Text>
      </View>
    );
  };

  const sortedVows = (type) => {
    return calendarCtx.vows
      .filter(vow => vow.type === type)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: currentTheme.primary }]}
        onPress={() => navigation.navigate('BindingVowForm')}
      >
        <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>Add Binding Vow</Text>
      </TouchableOpacity>
      <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>Major Binding Vows</Text>
      {sortedVows('major').length > 0 ? (
        sortedVows('major').map(renderVowItem)
      ) : (
        <Text style={[styles.noVowsText, { color: currentTheme.textSecondary }]}>No Major Binding Vows</Text>
      )}
      <Text style={[styles.heading, { color: currentTheme.textPrimary }]}>Minor Binding Vows</Text>
      {sortedVows('minor').length > 0 ? (
        sortedVows('minor').map(renderVowItem)
      ) : (
        <Text style={[styles.noVowsText, { color: currentTheme.textSecondary }]}>No Minor Binding Vows</Text>
      )}
    </ScrollView>
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
  addButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vowItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  vowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vowDescription: {
    fontSize: 16,
    marginVertical: 4,
  },
  vowDate: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  countdown: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noVowsText: {
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default BindingVow;
