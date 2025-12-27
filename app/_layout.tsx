// app/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Image, ImageBackground, ImageStyle, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from './Home';
import LikedScreen from './Liked';
import ConversationsScreen from './screens/ConversationsScreen';
import HisWillScreen from './screens/HisWillScreen';
import LoginScreen from './screens/LoginScreen';
import NewConversationScreen from './screens/NewConversationScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import SignUpScreen from './screens/SignUpScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import YourChoiceScreen from './screens/YourChoiceScreen';
import BackButton from './VerseModule/BackButton';
// Set the animation options. This is optional.

const { width, height } = Dimensions.get('window');

type RootDrawerParamList = {
  Home: undefined;
  Search: undefined;
  VerseModule: undefined;
  Liked: undefined;
  HisWillScreen: undefined;
  YourChoiceScreen: undefined;
  Profile: undefined;
  Conversations: undefined;
  NewConversation: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<AuthStackParamList>();

const DrawerToggleButton: React.FC<{ size?: number }> = ({ size }) => {
  const navigation = useNavigation();
  const iconSize = size || height * 0.035; // scales with screen height
  
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.drawerToggleButton}
    >
      <Ionicons name="menu-sharp" size={iconSize} color="white" />
    </TouchableOpacity>
  );
};

const CustomDrawerContent: React.FC<any> = (props) => {
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
          width: width * 0.75, // scales with screen width (~75% of screen width)
        },
        drawerLabelStyle: {
          color: 'white', // Updated from 'blue' to match theme
          lineHeight: height * 0.04, // scales with screen height
          fontSize: height * 0.031, // scales with screen height
          fontWeight: '300',
          textAlign: 'center'
          
        },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          color: 'white',
          fontSize: height * 0.031, // scales with screen height
        },
        headerRight: () => <DrawerToggleButton size={height * 0.043} />,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ 
          headerLeft: () => <Image source={require('../assets/images/splash-icon.png')} style={styles.logoImage} />,
          drawerLabel: 'HOME', headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>HOME</Text> }}
      />
      <Drawer.Screen
        name="HisWillScreen"
        component={HisWillScreen}
        options={{
          drawerLabel: 'HIS WILL',
          headerLeft: () => <BackButton text="" /> ,
          headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>HIS WILL</Text>,
        }}
      />
      <Drawer.Screen
        name="YourChoiceScreen"
        component={YourChoiceScreen}
        options={{headerLeft: () => <BackButton text="" /> ,drawerLabel: 'YOUR CHOICE', headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>YOUR CHOICE</Text>}}
      />
      <Drawer.Screen
        name="Liked"
        component={LikedScreen}
        options={{ drawerLabel: 'LIKED VERSES', headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>LIKED VERSES</Text> }}
      />
      <Drawer.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ drawerLabel: 'CONVERSATIONS', headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>CONVERSATIONS</Text> }}
      />
      <Drawer.Screen
        name="NewConversation"
        component={NewConversationScreen}
        options={{ 
          drawerLabel: () => null, // Hide from drawer
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
          headerLeft: () => <BackButton text="" />,
          headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>NEW CONVERSATION</Text>,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{ drawerLabel: 'PROFILE',
          headerLeft: () => <BackButton text="" /> ,
          headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '400' }}>PROFILE</Text>,
         }}
      />
    </Drawer.Navigator>
  );
};



const UnauthenticatedNavigator: React.FC = () => {
  return (
    <SafeAreaProvider>  
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTransparent: true,
          headerTitleStyle: { color: 'white', fontSize: height * 0.025, fontWeight: '400' },
        cardStyle: { backgroundColor: 'transparent', flex: 1 },
        headerTintColor: 'white',
        
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '500' }}>Promesas</Text> }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerLeft: () => <BackButton text="" />,
          headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '500' }}>Promesas</Text>,
        }}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{
          headerLeft: () => <BackButton text="Login" />,
          headerTitle: () => <Text style={{ color: 'white', fontSize: height * 0.025, fontWeight: '500' }}>Promesas</Text>,
        }}
      />
    </Stack.Navigator>
    </SafeAreaProvider>
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
    fontSize: height * 0.025, // scales with screen height
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: height * 0.04, // scales with screen height
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
    paddingTop: height * 0.185, // scales with screen height (~18.5% of screen height)
    backgroundColor: 'rgba(0, 0, 0, 0.50)', // Overlay for readability
    
  } as ViewStyle,
  logoutLabel: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 300,
    fontSize: height * 0.032, // scales with screen height
  },
  logoImage: {
    width: width * 0.08, // scales with screen width (~8% of screen width)
    height: width * 0.08, // scales with screen width (~8% of screen width)
    marginLeft: width * 0.053, // scales with screen width (~5.3% of screen width)
  } as ImageStyle,
  drawerToggleButton: {
    marginRight: width * 0.053, // scales with screen width (~5.3% of screen width)
  } as ViewStyle,
  appBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  } as ViewStyle,
});

export default function Layout() {
  return (
    <AuthProvider>
        <RootLayout />
    </AuthProvider>
  );
}