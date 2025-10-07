import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';
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

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return (
    <ScreenComponent>
      <Input
        cursorColor={"#ffffff"}
        selectionColor={'white'}
        placeholderTextColor={'white'}
        leftIcon={{ type: 'ionicons', name: 'person-outline', color: 'white', size: 30 }}
        inputStyle={{color: 'white', fontSize: 22}}
        labelStyle={{color: 'white'}}
        inputContainerStyle={{borderBottomColor: 'white'}}
      />

      <Input
        placeholder='INPUT WITH ICON'
        placeholderTextColor={'white'}
        leftIcon={{ name: 'account-outline', color: 'white' }}
        inputStyle={{color: 'white'}}
        labelStyle={{color: 'white'}}
        inputContainerStyle={{borderBottomColor: 'white'}}

      />
        <TouchableOpacity onPress={() => Alert.alert('Simple Button pressed')}>
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

export default LoginScreen;