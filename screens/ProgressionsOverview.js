import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarContext } from '../store/calendar-context';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';

function ProgressionsOverview({ navigation }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const calendarCtx = useContext(CalendarContext);

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.header, { color: currentTheme.textPrimary }]}>Major Vows</Text>
      {calendarCtx.vows.filter(vow => vow.type === 'major').map(vow => (
        <TouchableOpacity
          key={vow.id}
          style={[styles.card, { backgroundColor: currentTheme.primary }]}
          onPress={() => navigation.navigate('VowDetail', { vow })}
        > 
          <View style={styles.cardHeader}>
            <Ionicons name="trophy-outline" size={24} color={currentTheme.iconColor} />
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>{vow.title}</Text>
          </View>
          <Text style={[styles.cardDescription, { color: currentTheme.textSecondary }]}>{vow.description}</Text>
        </TouchableOpacity>
      ))}
      {calendarCtx.vows.filter(vow => vow.type === 'major').length === 0 && (
        <Text style={[styles.noVowsText, { color: currentTheme.textSecondary }]}>No Major Vows Available</Text>
      )}
      <Text style={[styles.header, { color: currentTheme.textPrimary }]}>Minor Vows</Text>
      {calendarCtx.vows.filter(vow => vow.type === 'minor').map(vow => (
        <TouchableOpacity
          key={vow.id}
          style={[styles.card, { backgroundColor: currentTheme.primary }]}
          onPress={() => navigation.navigate('VowDetail', { vow })}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="medal-outline" size={24} color={currentTheme.iconColor} />
            <Text style={[styles.cardTitle, { color: currentTheme.textPrimary }]}>{vow.title}</Text>
          </View>
          <Text style={[styles.cardDescription, { color: currentTheme.textSecondary }]}>{vow.description}</Text>
        </TouchableOpacity>
      ))}
      {calendarCtx.vows.filter(vow => vow.type === 'minor').length === 0 && (
        <Text style={[styles.noVowsText, { color: currentTheme.textSecondary }]}>No Minor Vows Available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#333', // Default background color if not provided by theme
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 16,
  },
  noVowsText: {
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default ProgressionsOverview;
