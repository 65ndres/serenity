import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';
import HomeScreen from './Home'; // Your current screen with the button
import RandomScreen from './Random'; // Your destination screen
import BackButton from './VerseModule/BackButton';
import LikesButton from './VerseModule/LikesButton';

const Stack = createStackNavigator();

export default function RootLayout() {
  

  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerTransparent: true,
        headerTitleStyle: {
          color: 'white',
          fontSize: 18,
        }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{
          headerTitle: () => <Text style={styles.text}>{"HIS WILL"}</Text>,
          headerRight: () => <LikesButton/>,
          headerLeft: () => <BackButton/>,
        }}/>
      <Stack.Screen name="Random" component={RandomScreen} />
    </Stack.Navigator>
  );
}




const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'light',
    textAlign: 'center',
  }
});



