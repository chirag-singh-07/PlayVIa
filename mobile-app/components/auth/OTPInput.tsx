import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    // Handle paste: if user pastes 6 digits into first box
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, length).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => { newOtp[i] = d; });
      setOtp(newOtp);
      onComplete(newOtp.join(''));
      // Focus last filled or last input
      const focusIdx = Math.min(digits.length, length - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Always update parent with current value
    onComplete(newOtp.join(''));

    // Auto-advance to next input
    if (text.length !== 0 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
          style={[
            styles.input,
            {
              backgroundColor: themeColors.surface,
              color: themeColors.textPrimary,
              borderColor: digit !== '' ? colors.primary : themeColors.border,
            }
          ]}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xl,
  },
  input: {
    width: 45,
    height: 56,
    borderWidth: 1,
    borderRadius: spacing.borderRadiusInputs,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
