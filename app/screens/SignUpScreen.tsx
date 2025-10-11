// src/screens/SignUpScreen.tsx
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
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

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  const handleSignup = async () => {
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
        onChangeText={setPasswordConfirmation}
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
      <Separator />
      <View>
        <Button
          containerStyle={{
            marginVertical: 10,
          }}
          title="Back to Login"
          type="clear"
          titleStyle={{ color: '#fff', fontWeight: 'bold' }}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        />
      </View>
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