import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, Text } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TextStyle,
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
      <View style={{paddingBottom: 40}}>
        <Text h2 style={{color: 'white', textAlign: 'center'}}>WELCOME BACK</Text>
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

      <Input
        cursorColor={"#ffffff"}
        placeholder='**********'
        selectionColor={'white'}
        placeholderTextColor={'#d8d8d8ff'}
        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#ffffffff', size: 30 }}
        inputStyle={{color: 'white', fontSize: 22, paddingLeft: 20}}
        labelStyle={{color: 'white'}}
        inputContainerStyle={{borderBottomColor: 'white'}}
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
      />
      <View>
        <Button
          containerStyle={{
            marginVertical: 10,
          }}
          title="Sign up"
          type="clear"
          titleStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
      </View>
      <View>
        <Button
          title="Forgot Password"
          type="clear"
          titleStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
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