import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { CalendarContext } from '../store/calendar-context';
import { ExpensesContext } from '../store/expenses-context';
import { getFormattedDate } from '../util/date';
import { getTheme } from '../constants/styles';
import { useTheme } from '../store/theme-context';
import moment from 'moment';

function CustomCalendar() {
  const navigation = useNavigation();
  const expensesCtx = useContext(ExpensesContext);
  const calendarCtx = useContext(CalendarContext);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const { theme } = useTheme();
  const currentTheme = useMemo(() => getTheme(theme), [theme]);

  // Ensure that the theme updates trigger re-render
  useEffect(() => {
    console.log('Theme changed:', theme, currentTheme);
  }, [theme, currentTheme]);

  // Filter expenses based on the selected date until the end of the month
  const filteredExpenses = expensesCtx.expenses.filter((expense) => {
    const expenseDate = moment(expense.date);
    const selectedMoment = moment(selectedDate);
    return (
      expenseDate.isSameOrAfter(selectedMoment, 'day') &&
      expenseDate.isSame(selectedMoment, 'month')
    );
  });

  // Filter vows and progressions based on the selected date until the end of the month
  const filteredVows = calendarCtx.vows.filter((vow) => {
    const vowDate = moment(vow.date);
    const selectedMoment = moment(selectedDate);
    return (
      vowDate.isSameOrAfter(selectedMoment, 'day') &&
      vowDate.isSame(selectedMoment, 'month')
    );
  });

  const filteredProgressions = Object.values(calendarCtx.progressions)
    .flat()
    .filter(progression => progression.completedDate)
    .filter((progression) => {
      const progressionDate = moment(progression.completedDate);
      const selectedMoment = moment(selectedDate);
      return (
        progressionDate.isSameOrAfter(selectedMoment, 'day') &&
        progressionDate.isSame(selectedMoment, 'month')
      );
    });

  // Combine expenses, vows, and progressions
  const combinedData = [...filteredExpenses, ...filteredVows, ...filteredProgressions].sort((a, b) => {
    return new Date(a.date || a.completedDate) - new Date(b.date || b.completedDate);
  });

  const markedDates = calendarCtx.vows.reduce((acc, vow) => {
    acc[getFormattedDate(vow.date)] = {
      marked: true,
      dotColor: '#ff0000', // Bright red tint for vows
    };
    return acc;
  }, {});

  markedDates[selectedDate] = {
    selected: true,
    marked: true,
    selectedColor: '#ff0000', // Bright red tint
  };

  function renderItem({ item }) {
    if (item.rating !== undefined && item.rating !== null) {
      // Render expense with rating
      return (
        <TouchableOpacity
          style={[styles.item, { backgroundColor: currentTheme.primary }]}
          onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
        >
          <View>
            <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Workout</Text>
            <Text style={[styles.itemText, { color: currentTheme.textPrimary }]}>{item.description}</Text>
            <Text style={[styles.itemDate, { color: currentTheme.textSecondary }]}>{getFormattedDate(item.date)}</Text>
          </View>
          <Text style={[styles.itemAmount, { color: currentTheme.textPrimary }]}>
            {item.rating.toFixed(1)}/10
          </Text>
        </TouchableOpacity>
      );
    } else if (item.title) {
      // Render vow
      const daysLeft = moment(item.date).diff(moment(), 'days') + 1;
      const startDate = item.startDate ? getFormattedDate(item.startDate) : 'Unknown';
      return (
        <View style={[styles.item, { backgroundColor: currentTheme.primary }]}>
          <View style={styles.vowDetails}>
            <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Binding Vow</Text>
            <Text style={[styles.itemText, { color: currentTheme.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.itemGoal, { color: currentTheme.textSecondary }]}>{item.goal}</Text>
            <Text style={[styles.itemDate, { color: currentTheme.textSecondary }]}>{startDate} - {getFormattedDate(item.date)}</Text>
            <Text style={[styles.countdown, { color: currentTheme.textPrimary }]}>{daysLeft} days left</Text>
          </View>
        </View>
      );
    } else {
      // Render progression
      return (
        <View style={[styles.item, { backgroundColor: currentTheme.primary }]} >
          <View style={styles.vowDetails}>
            <Text style={[styles.label, { color: currentTheme.textPrimary }]}>Progression</Text>
            <Text style={[styles.itemText, { color: currentTheme.textPrimary }]}>{item.text}</Text>
            <Text style={[styles.itemDate, { color: currentTheme.textSecondary }]}>{`Completed - ${getFormattedDate(item.completedDate)}`}</Text>
          </View>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <CalendarList
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: currentTheme.background,
          calendarBackground: currentTheme.background,
          textSectionTitleColor: currentTheme.textTertiary,
          dayTextColor: currentTheme.textSecondary,
          todayTextColor: '#ff0000', // Bright red tint
          selectedDayBackgroundColor: '#ff0000', // Bright red tint
          selectedDayTextColor: currentTheme.textPrimary,
          monthTextColor: currentTheme.textPrimary,
          indicatorColor: currentTheme.textPrimary,
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        style={styles.calendar}
        horizontal
        pagingEnabled
      />
      <FlatList
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.date + item.title || item.completedDate + item.text}
        ListEmptyComponent={
          <Text style={[styles.infoText, { color: currentTheme.textPrimary }]}>
            No ratings, vows, or progressions for the selected date range
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  item: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemGoal: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  countdown: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  vowDetails: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
  },
});

export default CustomCalendar;
 