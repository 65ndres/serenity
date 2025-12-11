// src/screens/LoginScreen.tsx
import { useColorScheme } from '@/hooks/useColorScheme'; // Adjust path if needed
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Animated, Image, StyleSheet, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import ScreenComponent from '../sharedComponents/ScreenComponent';



// Define navigation stack types
type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  
  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Animation duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [fadeAnim])
  );

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const handleNavigateToSignUp = () => {
    // Fade out the component
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start(() => {
      // Navigate after fade-out completes
      navigation.navigate('SignUp');
    });
  };

  const handleNavigateToPasswordReset = () => {
    // Fade out the component
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start(() => {
      // Navigate after fade-out completes
      navigation.navigate('PasswordReset');
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
    <ScreenComponent>
      <Animated.View style={{opacity: fadeAnim}}>
        <View style={styles.entirePage}>
          <View style={{height: '20%'}}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Text style={styles.welcomeText}>
                WELCOME BACK
              </Text>
            </View>
          </View>
          <View style={{height: '60%', overflow: 'hidden'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View>
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
                onChangeText={setEmail}
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
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Password"
              disabled={isLoading}
            />
            <Button
              title="LOG IN"
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
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
            />
            <View>
              <Button
                containerStyle={{
                  marginVertical: 10,
                }}
                title="Sign up"
                type="clear"
                titleStyle={{ color: '#fff', fontWeight: 'bold' }}
                onPress={handleNavigateToSignUp}
                disabled={isLoading}
              />
            </View>
            <View>
              <Button
                title="Password Reset"
                type="clear"
                titleStyle={{ color: '#fff', fontWeight: 'bold' }}
                onPress={handleNavigateToPasswordReset}
                disabled={isLoading}
              />
            </View>
            </View>
          </View>
          <View style={{height: '20%'}}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <Image source={require('../../assets/images/splash-icon.png')} style={{height: 60, width: 60, alignSelf: 'center'}} />
            </View>
          </View>
        </View>
      </Animated.View>
    </ScreenComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  name: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    // paddingBottom: 40,
    fontWeight: '500',
    // textDecorationLine: 'underline',
  } as TextStyle,
  welcomeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
  } as TextStyle,
});

export default LoginScreen;