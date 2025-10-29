// app/_layout.tsx
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from './Home';
import LikedScreen from './Liked';
import HisWillScreen from './screens/HisWillScreen';
import LoginScreen from './screens/LoginScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import SignUpScreen from './screens/SignUpScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import YourChoiceScreen from './screens/YourChoiceScreen';
import BackButton from './VerseModule/BackButton';

type RootDrawerParamList = {
  Home: undefined;
  Search: undefined;
  VerseModule: undefined;
  Liked: undefined;
  HisWillScreen: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<AuthStackParamList>();

const CustomDrawerContent: React.FC = (props) => {
  const { logout } = useAuth();

  return (
    <ImageBackground
      source={require('../assets/images/bgrd.jpg')}
      resizeMode="cover"
      
      style={styles.drawerBackground}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <DrawerItemList {...props} />
        <DrawerItem
        labelStyle
          label="Logout"
          onPress={async () => {
            await logout();
            // Redirect handled by RootLayout
          }}
          labelStyle={styles.logoutLabel}
        />
      </DrawerContentScrollView>
    </ImageBackground>
  );
};

const AuthenticatedNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"

      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveBackgroundColor:'transparent',
        headerTransparent: true,
        drawerStyle: {
          backgroundColor: 'transparent', // Transparent to show ImageBackground
          width: 250,
        },
        drawerLabelStyle: {
          color: 'white', // Updated from 'blue' to match theme
          fontSize: 26,
          fontWeight: '300',
          textAlign: 'center'
          
        },
        drawerItemStyle: {
          borderBottomColor: 'white',
          borderBottomWidth: 1
        },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          color: 'white',
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ drawerLabel: 'Home', headerTitle: () => <Text style={styles.text}></Text> }}
      />
      <Drawer.Screen
        name="HisWillScreen"
        component={HisWillScreen}
        options={{
          drawerLabel: 'His will',
          headerTitle: () => <Text style={styles.text}>HIS WILL</Text>,
        }}
      />
      <Drawer.Screen
        name="Liked"
        component={LikedScreen}
        options={{ drawerLabel: 'Liked Verses', headerTitle: () => <Text style={styles.text}>LIKED</Text> }}
      />
      <Drawer.Screen
        name="YourChoiceScreen"
        component={YourChoiceScreen}
        options={{ drawerLabel: 'Your Choice', headerTitle: () => <Text style={styles.text}>Your Choice</Text> }}
      />

      <Drawer.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{ drawerLabel: 'Profile', headerTitle: () => <Text style={styles.text}>Profile</Text> }}
      />
    </Drawer.Navigator>
  );
};



const UnauthenticatedNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTransparent: true,
        headerTitleStyle: { color: 'white', fontSize: 18 },
        cardStyle: { backgroundColor: 'transparent', flex: 1 },
        headerTintColor: 'white',
        
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerTitle: () => <Text style={{ color: 'transparent' }}>HOME</Text> }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerLeft: () => <BackButton text="Login" />,
          headerTitle: () => <Text style={{ color: 'transparent' }}>HOME</Text>,
        }}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{
          headerLeft: () => <BackButton text="Login" />,
          headerTitle: () => <Text style={{ color: 'transparent' }}>HOME</Text>,
        }}
      />
    </Stack.Navigator>
  );
};

const RootLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return user ? <AuthenticatedNavigator /> : <UnauthenticatedNavigator />;
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
  },
  drawerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    
  } as ViewStyle,
  drawerContent: {
    flex: 1,
    fontWeight: '900',
    color: 'blue',
    paddingTop: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.50)', // Overlay for readability
    
  } as ViewStyle,
  logoutLabel: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 300,
    fontSize: 26,
  },
});

export default function Layout() {
  return (
    <AuthProvider>
      {/* <NavigationContainer> */}
        <RootLayout />
      {/* </NavigationContainer> */}
    </AuthProvider>
  );
}