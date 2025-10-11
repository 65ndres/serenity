import { createStackNavigator } from '@react-navigation/stack';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import 'react-native-reanimated';
import HomeScreen from './Home';
import LikedScreen from './Liked';
import BackButton from './VerseModule/BackButton'; // this needs to be removed from this folder
import LikesButton from './VerseModule/LikesButton';
import VerseModule from './VerseModule/VerseModule';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import SignUpScreen from './screens/SignUpScreen';

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <AuthProvider>
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      resizeMode="cover"
      style={styles.image}
    >
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerTransparent: true,
          headerTitleStyle: {
            color: 'white',
            fontSize: 18,
          },
          cardStyle: { 
            flexDirection: 'column',
            backgroundColor: 'transparent', 
            display: 'flex', 
            flex: 1, 
            alignItems: 'center',
          }
        }}
      >
      <Stack.Screen name="Login" component={LoginScreen} options={{
          headerTitle: () => <Text style={{color: 'transparent'}}>{"HOME"}</Text>
        }}/>

      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{
          headerLeft: () => <BackButton text={"Login"}/>,
          headerTitle: () => <Text style={{color: 'transparent'}}>{"HOME"}</Text>
        }}/>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{
        headerLeft: () => <BackButton text={"Login"}/>,
          headerTitle: () => <Text style={{color: 'transparent'}}>{"HOME"}</Text>
                    
        }}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{
          headerTitle: () => <Text style={styles.text}>{"HOME"}</Text>
        }}/>
      <Stack.Screen name="VerseModule" component={VerseModule} options={{
          headerTitle: () => <Text style={styles.text}>{"HIS WILL"}</Text>,
          headerRight: () => <LikesButton/>,
        }}/>
      <Stack.Screen name="Liked" component={LikedScreen} options={{
          headerTitle: () => <Text style={styles.text}>{"Liked"}</Text>,
        }}/>
    </Stack.Navigator>
    </ImageBackground>
    </AuthProvider>
  );
}




const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'light',
    textAlign: 'center',
  },
  image: {
    flex: 1, // Ensures the background covers the entire screen
    width: '100%',
    height: '100%',
  },
});



