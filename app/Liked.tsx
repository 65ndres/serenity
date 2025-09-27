import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import LineItem from './LineItem';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

// Type the navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Type the Separator component
const Separator: React.FC = () => <View style={styles.separator} />;
const data = [
  {
    book: "Proverbs",
    chapter: 16,
    verse: 3,
    liked: false,
    favorited: false,
    text: "Commit to the Lord whatever you do, and he will establish your plans."
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    liked: false,
    favorited: false,
    text: "I can do all this through him who gives me strength."
  },
  {
    book: "James",
    chapter: 1,
    verse: 5,
    liked: false,
    favorited: false,
    text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."
  },
  {
    book: "Colossians",
    chapter: 3,
    verse: 23,
    liked: false,
    favorited: false,
    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
  },
  {
    book: "Ecclesiastes",
    chapter: 9,
    verse: 10,
    liked: false,
    favorited: false,
    text: "Whatever your hand finds to do, do it with all your might, for in the realm of the dead, where you are going, there is neither working nor planning nor knowledge nor wisdom."
  },
  {
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    liked: false,
    favorited: false,
    text: "Trust in the Lord with all your heart and lean not on your own understanding."
  },
  {
    book: "Galatians",
    chapter: 6,
    verse: 9,
    liked: false,
    favorited: false,
    text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."
  },
  {
    book: "Matthew",
    chapter: 7,
    verse: 7,
    liked: false,
    favorited: false,
    text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
  },
  {
    book: "Psalm",
    chapter: 90,
    verse: 17,
    liked: false,
    favorited: false,
    text: "May the favor of the Lord our God rest on us; establish the work of our hands for us—yes, establish the work of our hands."
  },
  {
    book: "Romans",
    chapter: 12,
    verse: 2,
    liked: false,
    favorited: false,
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will."
  }
];

// Type the Home component
const Liked: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      resizeMode="cover"
      style={styles.image}
    >
      <ScrollView
                      style={{
                    height: 500,
                }}
      >
        <View style={styles.container} >
          {data.map((item) => (
            <LineItem key={Math.random()} chapter={item.chapter} verse={item.verse} text={item.text} book={item.book}></LineItem>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  lineItem: {
    color: 'blue',
    justifyContent: 'center',
    width: '100%',
    borderColor: 'white' 
  },
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 150,
    paddingLeft: 30 ,
    paddingRight: 30
  } as ViewStyle,
  image: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

});

export default Liked;