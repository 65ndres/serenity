import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';
// import { ScreenContainer } from 'react-native-screens';
import ScreenComponent from '../sharedComponents/ScreenComponent';
import BackButton from '../VerseModule/BackButton';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

const width = Dimensions.get("window").width;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Separator: React.FC = () => <View style={styles.separator} />;

const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
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

  const handleBackPress = () => {
    // Fade out the component
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true,
    }).start(() => {
      // Navigate back after fade-out completes
      navigation.goBack();
    });
  };

  // Set header options dynamically with fade-out back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton 
          text="Login" 
          onPress={handleBackPress}
        />
      ),
    });
  }, [navigation]);

  return (
    <ScreenComponent>
      <Animated.View style={{opacity: fadeAnim }}>
      <View style={{paddingBottom: 40}}>
        <Text h2 style={{color: 'white', textAlign: 'center'}}>FORGOT?</Text>
      </View>
      <View style={{paddingBottom: 5}}>
        <Input
          cursorColor={"#ffffff"}
          placeholder='user@email.com'
          selectionColor={'white'}
          placeholderTextColor={'#d8d8d8ff'}
          leftIcon={{ type: 'font-awesome', name: 'user', color: '#ffffffff', size: 30 }}
          inputStyle={{color: 'white', fontSize: 22, paddingLeft: 20}}
          labelStyle={{color: 'white'}}
          inputContainerStyle={{borderBottomColor: 'white'}}
        />
      </View>
      <Button
        title="RESET PASSWORD"
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
      />
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
});

export default PasswordResetScreen;