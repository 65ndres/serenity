import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
const Separator = () => <View style={styles.separator} />;

export default function Home() {
  //  const [ShowVerseModule, setShowVerseModule] = useState(false); // State to toggle component
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (

      <ImageBackground source={require("../assets/images/bg.jpg")} resizeMode="cover" style={styles.image}>
        

        <>
        <TouchableOpacity onPress={() => navigation.navigate("VerseModule")}>
          <Text style={styles.text}>His will</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity onPress={() => Alert.alert('Simple Button pressed')}>
          <Text style={styles.text}>Your choice</Text>
        </TouchableOpacity>
        </> 

    
      </ImageBackground>

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



