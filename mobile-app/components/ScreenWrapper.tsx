import React from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ViewStyle 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withKeyboardAvoidView?: boolean;
  useSafeArea?: boolean;
  edges?: readonly ('top' | 'right' | 'bottom' | 'left')[];
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  style, 
  withKeyboardAvoidView = false,
  useSafeArea = true,
  edges = ['top', 'left', 'right']
}) => {
  const insets = useSafeAreaInsets();
  
  const content = (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );

  const wrapperWithSafeArea = useSafeArea ? (
    <SafeAreaView style={styles.container} edges={edges}>
      {content}
    </SafeAreaView>
  ) : content;

  if (withKeyboardAvoidView) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {wrapperWithSafeArea}
      </KeyboardAvoidingView>
    );
  }

  return wrapperWithSafeArea;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
});
