// src/screens/LoginScreen.tsx
import { useColorScheme } from '@/hooks/useColorScheme'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useAuth } from '../context/AuthContext';
import ScreenComponent from '../sharedComponents/ScreenComponent';

// Define navigation stack types
type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Separator: React.FC = () => <View style={styles.separator} />;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <ScreenComponent>
      <View style={{ paddingBottom: 40 }}>
        <Text h2 style={styles.welcomeText}>
          WELCOME BACK
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
          onPress={() => navigation.navigate('SignUp')}
          disabled={isLoading}
        />
      </View>
      <View>
        <Button
          title="Password Reset"
          type="clear"
          titleStyle={{ color: '#fff', fontWeight: 'bold' }}
          onPress={() => navigation.navigate('PasswordReset')}
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

export default LoginScreen;