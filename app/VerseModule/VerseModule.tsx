import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  liked: boolean;
  favorited: boolean;
  text: string;
}

interface Props {
  data: BibleVerse[];
  width: number;
  ref: React.RefObject<ICarouselInstance>;
}


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


const VerseModule: React.FC = () => {
  const [verses, setVerses] = useState<BibleVerse[]>(data);

  const ref = React.useRef<ICarouselInstance>(null);
    const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const toggleFavorite = (index: number) => {
    setVerses((prev) =>
      prev.map((verse, i) =>
        i === index ? { ...verse, favorited: !verse.favorited } : verse
      )
    );
  };

  return (
    <ImageBackground source={require("../../assets/images/bg.jpg")} resizeMode="cover" style={styles.image}>
      <View style={{flex: 1, justifyContent: 'center'}}>
      <Carousel
        ref={ref}
        width={width}
        height={width}
        data={verses}
        loop={true}
        autoPlay={false} // Set to true if you want auto-scrolling
        
        style={{ width: '100%' }}
          renderItem={({ item, index }) => (
            <View>
              <ScrollView
                style={{
                    paddingHorizontal: 15,
                    height: width - 200,
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 30, color: 'white' }}>{`"${item.text}"`}</Text>

              </ScrollView>
              <View style={{display: "flex", alignItems: 'center', paddingTop: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20}}>
                  <Text style={{ fontSize: 20, color: 'white' }}>{item.book} </Text>
                  <Text style={{ fontSize: 20, color: 'white' }}>{item.chapter} : </Text>
                  <Text style={{ fontSize: 20, color: 'white' }}>{item.verse}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(index)}
                    style={{ padding: 5}}
                    accessibilityLabel={item.favorited ? 'Unfavorite verse' : 'Favorite verse'}
                    accessibilityRole="button"
                  >
                    <AntDesign
                      name={item.favorited ? 'heart' : 'hearto'}
                      size={30}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
      />
    </View>
  </ImageBackground>);
  
};

export default VerseModule;



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


