import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '@rneui/themed';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';
import { API_URL } from '../../constants/Config';
// import { ScreenContainer } from 'react-native-screens';
import ScreenComponent from '../sharedComponents/ScreenComponent';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

const width = Dimensions.get("window").width;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Separator: React.FC = () => <View style={styles.separator} />;

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [firstNameError, setFirstNameError] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Fetch profile data on component load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data) {
        setFirstName(response.data.first_name || '');
        setLastName(response.data.last_name || '');
        setEmail(response.data.email || '');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const updateProfile = async () => {
    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    
    // Validate required fields
    let hasError = false;
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    }
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    }
    
    // Validate password fields - if either has characters, both must match
    const hasNewPassword = oldPassword.trim().length > 0;
    const hasConfirmPassword = newPassword.trim().length > 0;
    
    if (hasNewPassword || hasConfirmPassword) {
      if (oldPassword !== newPassword) {
        setNewPasswordError('Passwords do not match');
        setConfirmPasswordError('Passwords do not match');
        hasError = true;
      }
    }
    
    if (hasError) {
      return;
    }
    
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const payload: any = {
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
      };
      
      // Only include password field if it's provided
      if (oldPassword.trim() && newPassword.trim()) {
        payload.new_password = newPassword;
      }
      
      await axios.post(`${API_URL}/user`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      
      // Clear password fields after successful update
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenComponent>
      <View style={{height: "15%"}}>

      </View>

      <View style={{height: "65%"}}>
      <View style={{paddingBottom: 5}}>
        <Input
          cursorColor={"#ffffff"}
          placeholder='First name'
          selectionColor={'white'}
          placeholderTextColor={'#d8d8d8ff'}
          leftIcon={{ type: 'font-awesome', name: 'user', color: '#ffffffff', size: 25 }}
          inputStyle={{color: 'white', fontSize: 18, paddingLeft: 20}}
          labelStyle={{color: 'white'}}
          inputContainerStyle={{borderBottomColor: 'white'}}
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (firstNameError) setFirstNameError('');
          }}
          errorMessage={firstNameError}
          errorStyle={styles.errorStyle}
          disabled={isLoadingProfile || isLoading}
        />
        <Input
          cursorColor={"#ffffff"}
          placeholder='Last name'
          selectionColor={'white'}
          placeholderTextColor={'#d8d8d8ff'}
          leftIcon={{ type: 'font-awesome', name: 'user', color: '#ffffffff', size: 25 }}
          inputStyle={{color: 'white', fontSize: 18, paddingLeft: 20}}
          inputContainerStyle={{borderBottomColor: 'white'}}
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            if (lastNameError) setLastNameError('');
          }}
          errorMessage={lastNameError}
          errorStyle={styles.errorStyle}
          disabled={isLoadingProfile || isLoading}
        />
        <Input
          cursorColor={"#ffffff"}
          placeholder='user@email.com'
          selectionColor={'white'}
          placeholderTextColor={'#d8d8d8ff'}
          leftIcon={{ type: 'materialIcons', name: 'alternate-email', color: '#ffffffff', size: 25 }}
          inputStyle={{color: 'white', fontSize: 18, paddingLeft: 10}}
          labelStyle={{color: 'white'}}
          inputContainerStyle={{borderBottomColor: 'white'}}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          disabled={true}
        />
        <Text style={{color: 'white', fontSize: 15, fontWeight: '300', textAlign: 'center', fontStyle: 'italic', paddingBottom: 10}}>*You will be singed out if the password is changed.</Text>
      <Input
        cursorColor="#ffffff"
        placeholder="New Password"
        selectionColor="white"
        placeholderTextColor="#d8d8d8ff"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: 25 }}
        inputStyle={{ color: 'white', fontSize: 18, paddingLeft: 20 }}
        labelStyle={{ color: 'white' }}
        inputContainerStyle={{ borderBottomColor: 'white' }}
        value={oldPassword}
        onChangeText={(text) => {
          setOldPassword(text);
          if (newPasswordError || confirmPasswordError) {
            setNewPasswordError('');
            setConfirmPasswordError('');
          }
        }}
        errorMessage={newPasswordError}
        errorStyle={styles.errorStyle}
        secureTextEntry
        accessibilityLabel="New Password"
        disabled={isLoadingProfile || isLoading}
      />
      <Input
        cursorColor="#ffffff"
        placeholder="Confirm New Password"
        selectionColor="white"
        placeholderTextColor="#d8d8d8ff"
        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: 25 }}
        inputStyle={{ color: 'white', fontSize: 18, paddingLeft: 20 }}
        labelStyle={{ color: 'white' }}
        inputContainerStyle={{ borderBottomColor: 'white' }}
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          if (newPasswordError || confirmPasswordError) {
            setNewPasswordError('');
            setConfirmPasswordError('');
          }
        }}
        errorMessage={confirmPasswordError}
        errorStyle={styles.errorStyle}
        secureTextEntry
        accessibilityLabel="Confirm New Password"
        disabled={isLoadingProfile || isLoading}
      />
      </View>
      <Button
        title="Update"
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
        onPress={updateProfile}
        disabled={isLoading || isLoadingProfile}
        loading={isLoading}
      />
      </View>
      <View style={{height: "20%"}}>
        <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 15, fontWeight: '500', textAlign: 'center'}}>Promesas</Text>
        </View>
      </View>
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
    lineHeight: 64,
    fontWeight: '300', // Use numeric value for better TypeScript compatibility ('light' equivalent)
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
  errorStyle: {
    color: '#ff6b6b',
    fontSize: 14,
  } as TextStyle,
});

export default UserProfileScreen;