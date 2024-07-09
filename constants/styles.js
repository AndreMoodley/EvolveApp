export const GlobalStyles = {
  light: {
    background: '#ffffff',
    primary: '#8b0000',  // Dark red color
    primaryLight: '#800020', // Burgundy color
    primary800: '#8b0000', // Dark red color 
    textPrimary: '#000000',
    textSecondary: '#39324a',
    textTertiary: '#b6c1cd',
    accent: '#f7bc0c',
    error: '#9b095c',
    errorBackground: '#fcc4e4',
  },
  dark: {
    background: '#000000',
    primary: '#8b0000', // Dark red color
    primaryLight: '#800020', // Burgundy color
    primary800: '#8b0000', // Dark red color 
    textPrimary: '#ffffff',
    textSecondary: '#d9e1e8',
    textTertiary: '#b6c1cd',
    accent: '#f7bc0c',
    error: '#9b095c',
    errorBackground: '#fcc4e4',
  },
}; 
 
export const getTheme = (theme) => {
  const selectedTheme = GlobalStyles[theme];
  if (!selectedTheme) { 
    return GlobalStyles.dark;
  }
  return selectedTheme;
};
