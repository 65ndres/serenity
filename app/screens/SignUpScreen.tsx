import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import 'react-native-reanimated';
import PasswordInputs from '../../components/PasswordInputs';
import { useAuth } from '../context/AuthContext';
import ScreenComponent from '../sharedComponents/ScreenComponent';


type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  const handleSignup = async () => {
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
      setPasswordError('Passwords do not match');
      setPasswordConfirmationError('Passwords do not match');
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
      <Animated.View style={[styles.animatedView, { opacity: fadeAnim }]}>
        <View style={styles.topSection}>
          <View style={styles.topSectionInner}>
          <Text h2 style={styles.welcomeText}>
            WELCOME
          </Text>
          </View>
        </View>
        <View style={styles.middleSection}>
          <View style={styles.middleSectionInner}>
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
        <PasswordInputs
          newPassword={password}
          confirmPassword={passwordConfirmation}
          onNewPasswordChange={(text) => {
            setPassword(text);
            if (passwordError || passwordConfirmationError) {
              setPasswordError('');
              setPasswordConfirmationError('');
            }
          }}
          onConfirmPasswordChange={(text) => {
            setPasswordConfirmation(text);
            if (passwordError || passwordConfirmationError) {
              setPasswordError('');
              setPasswordConfirmationError('');
            }
          }}
          newPasswordError={passwordError}
          confirmPasswordError={passwordConfirmationError}
          disabled={isLoading}
        />
        <Button
          title="CREATE ACCOUNT"
          buttonStyle={styles.signupButton}
          containerStyle={styles.signupButtonContainer}
          titleStyle={styles.signupButtonTitle}
          onPress={handleSignup}
          disabled={isLoading}
          loading={isLoading}
        />
        </View>
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.bottomSectionInner}>
          <Image source={require('../../assets/images/splash-icon.png')} style={styles.logoImage} />
          </View>
        </View>
      </Animated.View>
    </ScreenComponent>
  );
};

const styles = StyleSheet.create({
  animatedView: {
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
  errorStyle: {
    color: '#ff6b6b',
    fontSize: screenWidth * 0.037,
  } as TextStyle,
  signupButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: screenWidth * 0.08,
  } as ViewStyle,
  signupButtonContainer: {
    marginHorizontal: screenWidth * 0.13,
    marginVertical: screenHeight * 0.012,
  } as ViewStyle,
  signupButtonTitle: {
    fontWeight: 'bold',
    color: '#ac8861ff',
    fontSize: screenWidth * 0.047,
  } as TextStyle,
  separator: {
    marginVertical: screenHeight * 0.01,
    width: '80%',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  } as ViewStyle,
  logoImage: {
    height: screenWidth * 0.16,
    width: screenWidth * 0.16,
    alignSelf: 'center',
  } as ImageStyle,
});

export default SignUpScreen;