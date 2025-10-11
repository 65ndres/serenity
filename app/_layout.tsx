// app/_layout.tsx
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from './Home';
import LikedScreen from './Liked';
import LoginScreen from './screens/LoginScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import SignUpScreen from './screens/SignUpScreen';
import VerseModuleScreen from './VerseModule/VerseModule';

type RootDrawerParamList = {
  Home: undefined;
  Search: undefined;
  VerseModule: undefined;
  Liked: undefined;
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
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={async () => {
          await logout();
          // Redirect handled by RootLayout
        }}
        labelStyle={{ color: '#ac8861ff', fontWeight: 'bold' }}
      />
    </DrawerContentScrollView>
  );
};

const AuthenticatedNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          width: 250,
        },
        drawerLabelStyle: {
          color: 'white',
          fontSize: 16,
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
        options={{ drawerLabel: 'Home', headerTitle: () => <Text style={styles.text}>HOME</Text> }}
      />
      <Drawer.Screen
        name="VerseModule"
        component={VerseModuleScreen}
        options={{
          drawerLabel: 'Verse Module',
          headerTitle: () => <Text style={styles.text}>HIS WILL</Text>,
          headerRight: () => <LikesButton />,
        }}
      />
      <Drawer.Screen
        name="Liked"
        component={LikedScreen}
        options={{ drawerLabel: 'Liked Verses', headerTitle: () => <Text style={styles.text}>LIKED</Text> }}
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
        cardStyle: { backgroundColor: 'transparent', flex: 1, alignItems: 'center' },
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
});

export default function Layout() {
  return (
    <AuthProvider>
        <RootLayout />
    </AuthProvider>
  );
}