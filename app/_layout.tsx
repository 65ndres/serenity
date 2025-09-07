import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import HomeScreen from './Home'; // Your current screen with the button
import RandomScreen from './Random'; // Your destination screen
const Separator = () => <View style={styles.separator} />;

const Stack = createStackNavigator();

export default function RootLayout() {
  

  return (


      <Stack.Navigator  initialRouteName="Home"
        screenOptions={{
    headerStyle: {
      backgroundColor: 'rgba(241, 11, 11, 0)',
      elevation: 0,
      shadowOpacity: 0,
      opacity: 0,
      
    },
    headerTransparent: true,
    headerTitleStyle: {
      color: 'white',
      fontSize: 18,
    },
    headerTintColor: 'white',
  }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Random" component={RandomScreen} />
      </Stack.Navigator>


  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 44,
    lineHeight: 84,
    fontWeight: 'light',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 8,
    width:"80%",
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});



