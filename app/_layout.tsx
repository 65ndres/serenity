import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';
import HomeScreen from './Home'; // Your current screen with the button
// import RandomScreen from './Random'; // Your destination screen
import LikedScreen from './Liked';
import BackButton from './VerseModule/BackButton'; // this needs to be removed from this folder
import LikesButton from './VerseModule/LikesButton';
import VerseModule from './VerseModule/VerseModule';

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
          headerTitle: () => <Text style={styles.text}>{"HOME"}</Text>
        }}/>
      <Stack.Screen name="VerseModule" component={VerseModule} options={{
          headerTitle: () => <Text style={styles.text}>{"HIS WILL"}</Text>,
          headerRight: () => <LikesButton/>,
          headerLeft: () => <BackButton/>,
        }}/>
      <Stack.Screen name="Liked" component={LikedScreen} options={{
          headerTitle: () => <Text style={styles.text}>{"Liked"}</Text>,
          headerLeft: () => <BackButton/>,
        }}/>
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



