import { StyleSheet, Text, TextInput, View } from 'react-native';
import { getTheme } from '../../constants/styles';

function Input({ label, invalid, style, textInputConfig, theme }) {
  const currentTheme = getTheme(theme);

  const inputStyles = [styles.input, { backgroundColor: currentTheme.primaryLight, color: currentTheme.textPrimary }];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push({ backgroundColor: currentTheme.errorBackground });
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && { color: currentTheme.error }]}>{label}</Text>
      <TextInput style={inputStyles} {...textInputConfig} />
    </View>
  );
}
  
export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
