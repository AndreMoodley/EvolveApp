import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../store/theme-context';
import { GlobalStyles, getTheme } from '../../constants/styles';

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: currentTheme.textPrimary }, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: currentTheme.primaryLight }, isInvalid && styles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

export default Input;
 
const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  labelInvalid: {
    color: GlobalStyles.dark.error,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: GlobalStyles.dark.error,
  },
});
