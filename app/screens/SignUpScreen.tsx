// src/screens/SignUpScreen.tsx
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import ScreenComponent from '../sharedComponents/ScreenComponent';

// Define navigation stack types
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
  Login: undefined; // Added to allow navigation back to Login
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const width = Dimensions.get('window').width;

const Separator: React.FC = () => <View style={styles.separator} />;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const { signup } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  const handleSignup = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setPasswordConfirmationError('');
    
    // Validate required fields
    let hasError = false;
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }
    if (!passwordConfirmation.trim()) {
      setPasswordConfirmationError('Password confirmation is required');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    const success = await signup(email, password, passwordConfirmation);
    setIsLoading(false);
    if (success) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Signup failed. Please check your details and try again.');
    }
  };

  return (
    <ScreenComponent>
      <Animated.View style={{opacity: fadeAnim }}>
        <View style={{ paddingBottom: 40 }}>
          <Text h2 style={styles.welcomeText}>
            WELCOME
          </Text>
        </View>
        <View style={{ paddingBottom: 5 }}>
          <Input
            cursorColor="#ffffff"
            placeholder="user@email.com"
            selectionColor="white"
            placeholderTextColor="#d8d8d8ff"
            leftIcon={{ type: 'font-awesome', name: 'user', color: '#ffffffff', size: 30 }}
            inputStyle={{ color: 'white', fontSize: 22, paddingLeft: 20 }}
            labelStyle={{ color: 'white' }}
            inputContainerStyle={{ borderBottomColor: 'white' }}
            value={email}
            onChangeText={(text) => {
              setEmail(text.toLowerCase());
              if (emailError) setEmailError('');
            }}
            errorMessage={emailError}
            errorStyle={{ color: '#ff6b6b', fontSize: 14 }}
            accessibilityLabel="Email"
            disabled={isLoading}
          />
        </View>
        <Input
          cursorColor="#ffffff"
          placeholder="**********"
          selectionColor="white"
          placeholderTextColor="#d8d8d8ff"
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: 30 }}
          inputStyle={{ color: 'white', fontSize: 22, paddingLeft: 20 }}
          labelStyle={{ color: 'white' }}
          inputContainerStyle={{ borderBottomColor: 'white' }}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          errorMessage={passwordError}
          errorStyle={{ color: '#ff6b6b', fontSize: 14 }}
          secureTextEntry
          accessibilityLabel="Password"
          disabled={isLoading}
        />
        <Input
          cursorColor="#ffffff"
          placeholder="Confirm Password"
          selectionColor="white"
          placeholderTextColor="#d8d8d8ff"
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: 30 }}
          inputStyle={{ color: 'white', fontSize: 22, paddingLeft: 20 }}
          labelStyle={{ color: 'white' }}
          inputContainerStyle={{ borderBottomColor: 'white' }}
          value={passwordConfirmation}
          onChangeText={(text) => {
            setPasswordConfirmation(text);
            if (passwordConfirmationError) setPasswordConfirmationError('');
          }}
          errorMessage={passwordConfirmationError}
          errorStyle={{ color: '#ff6b6b', fontSize: 14 }}
          secureTextEntry
          accessibilityLabel="Confirm Password"
          disabled={isLoading}
        />
        <Button
          title="CREATE ACCOUNT"
          buttonStyle={{
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 30,
          }}
          containerStyle={{
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          titleStyle={{ fontWeight: 'bold', color: '#ac8861ff' }}
          onPress={handleSignup}
          disabled={isLoading}
          loading={isLoading}
        />
      </Animated.View>
    </ScreenComponent>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    color: 'white',
    textAlign: 'center',
  } as TextStyle,
  separator: {
    marginVertical: 8,
    width: '80%',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  } as ViewStyle,
});

export default SignUpScreen;