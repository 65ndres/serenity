import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from 'expo-font';
import * as React from "react";
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel, {
  ICarouselInstance
} from "react-native-reanimated-carousel";
 
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
const width = Dimensions.get("window").width;

const QuotePresenter: React.FC = () => {
  const ref = React.useRef<ICarouselInstance>(null);
    const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (

      <ImageBackground source={require("../assets/images/bg.jpg")} resizeMode="cover" style={styles.image}>
      <View style={styles.main}>
      <Carousel
        ref={ref}
        width={width}
        height={width}
        data={data}
        renderItem={({ item }) => (
          <View>
          <ScrollView
            style={{
                paddingHorizontal: 50,
                borderWidth: 1,
                height: width - 100
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30, color: 'white' }}>{`"${item.text}"`}</Text>

          </ScrollView>
  <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{ fontSize: 20, color: 'white' }}>{item.book}</Text>
      <Text style={{ fontSize: 20, color: 'white' }}>{item.chapter}:</Text>
      <Text style={{ fontSize: 20, color: 'white' }}>{item.verse}</Text>
    </View>
    <View>
      <AntDesign name="hearto" size={20} color="white" />
    </View>
  </View>
            
            </View>
        )}
      />
      </View>
      </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main:{
    
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



export default QuotePresenter;