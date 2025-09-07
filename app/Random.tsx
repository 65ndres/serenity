import { useFonts } from 'expo-font';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
import 'react-native-reanimated';

export default function Random() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (

      <ImageBackground source={require("../assets/images/bg.jpg")} resizeMode="cover" style={styles.image}>
        <TouchableOpacity onPress={() => Alert.alert('Simple Button pressed')}>
          <Text style={styles.text}>Randome shit</Text>
        </TouchableOpacity>
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



