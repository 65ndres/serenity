import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';
import ScreenComponent from './sharedComponents/ScreenComponent';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

// Type the navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Type the Separator component
const Separator: React.FC = () => <View style={styles.separator} />;

// Type the Home component
const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ScreenComponent>
      <TouchableOpacity onPress={() => navigation.navigate('HisWillScreen')}>
        <Text style={styles.text}>His will</Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity onPress={() => navigation.navigate('YourChoiceScreen')}>
        <Text style={styles.text}>Your choice</Text>
      </TouchableOpacity>
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

export default Home;