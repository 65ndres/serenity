import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';
import { API_URL } from '../../constants/Config';
import ScreenComponent from '../sharedComponents/ScreenComponent';
import BackButton from '../VerseModule/BackButton';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
  PasswordReset: undefined;
  PasswordCode: {
    email: string;
  };
};

const width = Dimensions.get("window").width;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Separator: React.FC = () => <View style={styles.separator} />;

const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleBackPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  // Set header options dynamically with fade-out back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton 
          text="" 
          onPress={handleBackPress}
        />
      ),
    });
  }, [navigation]);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the API to send password reset email
      // Note: The endpoint might be different - adjust based on your API
      await axios.post(`${API_URL}/auth/password`, {
        email: email.trim()
      });
      setEmailSubmitted(true);
    } catch (error: any) {
      console.error('Password reset request failed', error);
      setEmailError(error.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSubmitted(false);
    setEmail('');
    setEmailError('');
  };

  const handleInputCode = () => {
    navigation.navigate('PasswordCode', { email: email.trim() });
  };

  if (!loaded) {
    return null;
  }

  return (
    <ScreenComponent>
      <Animated.View style={{opacity: fadeAnim }}>
        <View>
          <View style={{height: "25%"}}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Text h2 style={{color: 'white', textAlign: 'center'}}>FORGOT?</Text>
            </View>
          </View>

          <View style={{height: "55%"}}>
            {!emailSubmitted ? (
             
                <View style={{flex: 1, justifyContent: 'flex-start', marginTop: 60}}>
                  <View style={{paddingBottom: 5}}>
                    <Input
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError('');
                      }}
                      cursorColor={"#ffffff"}
                      placeholder='user@email.com'
                      selectionColor={'white'}
                      placeholderTextColor={'#d8d8d8ff'}
                      leftIcon={{ type: 'font-awesome', name: 'user', color: '#ffffffff', size: 30 }}
                      inputStyle={{color: 'white', fontSize: 22, paddingLeft: 20}}
                      labelStyle={{color: 'white'}}
                      inputContainerStyle={{borderBottomColor: 'white'}}
                      errorMessage={emailError}
                      errorStyle={{color: '#ff6b6b'}}
                      disabled={isSubmitting}
                    />
                  </View>
                  <Button
                    title={isSubmitting ? "SENDING..." : "RESET PASSWORD"}
                    buttonStyle={{
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: 'white',
                      borderRadius: 30,
                      height: 60,
                    }}
                    containerStyle={{
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold', color: '#ac8861ff' }}
                    onPress={handleEmailSubmit}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  />
                </View>
            ) : (
              <View style={{height: '100%'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: 'white', fontSize: 22, fontWeight: '500', textAlign: 'center'}}>We will send you an email if the email is registered.
                  </Text>
                  <Text style={{color: 'white', fontSize: 18, fontWeight: '300', textAlign: 'center'}}>If you don't receive an email, please check your spam folder.</Text>
                </View>
                <View style={styles.buttonContainer}>

                  <Button
                    title="TRY AGAIN"
                    buttonStyle={{
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: 'white',
                      borderRadius: 30,
                      // marginBottom: 20,
                      height: 60,
                    }}
                    containerStyle={{
                      // marginHorizontal: 50,
                    }}
                    titleStyle={{ fontWeight: 'bold', color: '#ac8861ff' }}
                    onPress={handleTryAgain}
                  />
                  <Button
                    title="INPUT CODE"
                    buttonStyle={{
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: 'white',
                      borderRadius: 30,
                      height: 60,
                    }}
                    containerStyle={{
                      // marginHorizontal: 50,
                    }}
                    titleStyle={{ fontWeight: 'bold', color: '#ac8861ff' }}
                    onPress={handleInputCode}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={{height: "20%"}}> 
          <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
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
  container: {
    flex: 1,
  } as ViewStyle,
  image: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  text: {
    color: 'white',
    fontSize: 44,
    lineHeight: 84,
    fontWeight: '300',
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    alignItems: 'flex-start',
    // width: '100%',
  } as ViewStyle,
  logoImage: {
    height: 80,
    width: 80,
    alignSelf: 'center',
  } as ImageStyle,
});

export default PasswordResetScreen;
