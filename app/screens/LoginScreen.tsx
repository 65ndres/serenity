// src/screens/LoginScreen.tsx
import { useColorScheme } from '@/hooks/useColorScheme'; // Adjust path if needed
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, StyleSheet, View, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { useAuth } from '../context/AuthContext';
import ScreenComponent from '../sharedComponents/ScreenComponent';

type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
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
    
    if (hasError) {
      return;
    }
    
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const handleNavigateToSignUp = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('SignUp');
    });
  };

  const handleNavigateToPasswordReset = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('PasswordReset');
    });
  };

  return (
    
      <ScreenComponent>
        <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
          <View style={styles.entirePage}>
            <View style={styles.topSection}>
              <View style={styles.topSectionInner}>
                <Text style={styles.welcomeText}>
                  WELCOME BACK
                </Text>
              </View>
            </View>
            <View style={styles.middleSection}>
              <View style={styles.middleSectionInner}>
                <View>
                  <Input
                    cursorColor="#ffffff"
                    placeholder="user@email.com"
                    selectionColor="white"
                    placeholderTextColor="#d8d8d8ff"
                    leftIcon={{ type: 'font-awesome', name: 'user', color: '#ffffffff', size: screenWidth * 0.08 }}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text.toLowerCase());
                      if (emailError) setEmailError('');
                    }}
                    errorMessage={emailError}
                    errorStyle={styles.errorStyle}
                    accessibilityLabel="Email"
                    disabled={isLoading}
                  />
                </View>
                <Input
                  cursorColor="#ffffff"
                  placeholder="password"
                  selectionColor="white"
                  placeholderTextColor="#d8d8d8ff"
                  leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: screenWidth * 0.08 }}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  errorMessage={passwordError}
                  errorStyle={styles.errorStyle}
                  secureTextEntry
                  accessibilityLabel="Password"
                  disabled={isLoading}
                />
                <Button
                  title="LOG IN"
                  buttonStyle={styles.loginButton}
                  containerStyle={styles.loginButtonContainer}
                  titleStyle={styles.loginButtonTitle}
                  onPress={handleLogin}
                  disabled={isLoading}
                  loading={isLoading}
                />
                <View>
                  <Button
                    containerStyle={styles.secondaryButtonContainer}
                    title="Sign up"
                    type="clear"
                    titleStyle={styles.secondaryButtonTitle}
                    onPress={handleNavigateToSignUp}
                    disabled={isLoading}
                  />
                </View>
                <View>
                  <Button
                    title="Password Reset"
                    type="clear"
                    titleStyle={styles.secondaryButtonTitle}
                    onPress={handleNavigateToPasswordReset}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
            <View style={styles.bottomSection}>
              <View style={styles.bottomSectionInner}>
                <Image source={require('../../assets/images/splash-icon.png')} style={styles.logoImage} />
              </View>
            </View>
          </View>
        </Animated.View>
      </ScreenComponent>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
  } as ViewStyle,
  entirePage: {
    flex: 1,
  } as ViewStyle,
  topSection: {
    height: '20%',
  } as ViewStyle,
  topSectionInner: {
    flex: 1,
    justifyContent: 'flex-end',
  } as ViewStyle,
  middleSection: {
    height: '60%',
    overflow: 'hidden',
  } as ViewStyle,
  middleSectionInner: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  bottomSection: {
    height: '20%',
  } as ViewStyle,
  bottomSectionInner: {
    flex: 1,
    justifyContent: 'flex-end',
  } as ViewStyle,
  welcomeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: screenWidth * 0.08,
  } as TextStyle,
  inputStyle: {
    color: 'white',
    fontSize: screenWidth * 0.06,
    paddingLeft: screenWidth * 0.05,
  } as TextStyle,
  labelStyle: {
    color: 'white',
  } as TextStyle,
  inputContainerStyle: {
    borderBottomColor: 'white',
  } as ViewStyle,
  loginButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: screenWidth * 0.08,
  } as ViewStyle,
  loginButtonContainer: {
    marginHorizontal: screenWidth * 0.13,
    marginVertical: screenHeight * 0.012,
  } as ViewStyle,
  loginButtonTitle: {
    fontWeight: 'bold',
    color: '#ac8861ff',
    fontSize: screenWidth * 0.05,
  } as TextStyle,
  secondaryButtonContainer: {
    marginVertical: screenHeight * 0.012,
  } as ViewStyle,
  secondaryButtonTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.05,
  } as TextStyle,
  logoImage: {
    height: screenWidth * 0.16,
    width: screenWidth * 0.16,
    alignSelf: 'center',
  } as ImageStyle,
  errorStyle: {
    color: '#ff6b6b',
    fontSize: screenWidth * 0.037,
  } as TextStyle,
});

export default LoginScreen;