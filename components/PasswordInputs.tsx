import { Input } from '@rneui/themed';
import React from 'react';
import { Dimensions, StyleSheet, TextStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

interface PasswordInputsProps {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  newPasswordError?: string;
  confirmPasswordError?: string;
  disabled?: boolean;
}

const PasswordInputs: React.FC<PasswordInputsProps> = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  newPasswordError,
  confirmPasswordError,
  disabled = false,
}) => {
  return (
    <>
      <Input
        cursorColor="#ffffff"
        placeholder="New Password"
        selectionColor="white"
        placeholderTextColor="#d8d8d8ff"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: height * 0.037 }}
        inputStyle={{ color: 'white', fontSize: height * 0.025, paddingLeft: width * 0.053 }}
        labelStyle={{ color: 'white' }}
        inputContainerStyle={{ borderBottomColor: 'white' }}
        value={newPassword}
        onChangeText={onNewPasswordChange}
        errorMessage={newPasswordError}
        errorStyle={styles.errorStyle}
        secureTextEntry
        accessibilityLabel="New Password"
        disabled={disabled}
      />
      <Input
        cursorColor="#ffffff"
        placeholder="Confirm New Password"
        selectionColor="white"
        placeholderTextColor="#d8d8d8ff"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: height * 0.037 }}
        inputStyle={{ color: 'white', fontSize: height * 0.025, paddingLeft: width * 0.053 }}
        labelStyle={{ color: 'white' }}
        inputContainerStyle={{ borderBottomColor: 'white' }}
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        errorMessage={confirmPasswordError}
        errorStyle={styles.errorStyle}
        secureTextEntry
        accessibilityLabel="Confirm New Password"
        disabled={disabled}
      />
    </>
  );
};

const styles = StyleSheet.create({
  errorStyle: {
    color: '#ff6b6b',
    fontSize: height * 0.017,
  } as TextStyle,
});

export default PasswordInputs;

