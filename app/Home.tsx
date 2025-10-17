// app/home.tsx
import { useColorScheme } from '@/hooks/useColorScheme';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import 'react-native-reanimated';
import { useAuth } from "../app/context/AuthContext";
import ScreenComponent from '../app/sharedComponents/ScreenComponent';

// Define the navigation stack param list
type RootDrawerParamList = {
  Home: undefined;
  Search: undefined;
  VerseModule: undefined;
  Liked: undefined;
};

// Type the navigation prop
type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

// Type the Separator component
const Separator: React.FC = () => <View style={styles.separator} />;

// Type the Home component
const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const { user, subscribe } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ScreenComponent>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>BIBLE APP</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VerseModule')}>
          <Text style={styles.text}>His Will</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity onPress={() => Alert.alert('Simple Button pressed')}>
          <Text style={styles.text}>Your Choice</Text>
        </TouchableOpacity>
        <Separator />
        <Text style={styles.text}>
          Subscription: {user?.subscriptionStatus || 'none'}
        </Text>
        {!user?.subscriptionStatus || user.subscriptionStatus === 'canceled' ? (
          <Button
            title="Subscribe to Premium"
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
            onPress={() => subscribe('premium_plan_id', 'apple')} // Replace with actual plan ID
          />
        ) : null}
      </View>
    </ScreenComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  welcomeText: {
    color: 'white',
    fontSize: 44,
    lineHeight: 84,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
  } as TextStyle,
  text: {
    color: 'white',
    fontSize: 44,
    lineHeight: 84,
    fontWeight: '300',
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