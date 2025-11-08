import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
  ['favorited']?: boolean;
}

interface VerseModuleProps {
  data: Verse[];
  active: number;
  url: string; // New prop: background image URL
}

const width = Dimensions.get("window").width;

const VerseModule: React.FC<VerseModuleProps> = ({ data, active, url }) => {
  debugger
  // if url is empty then show an empty message

  // const [ fetchUrl, setFetchUrl] = useState(url)
  const [verses, setVerses] = useState([])
  const [fetchUrl, setFetchUrl] = useState(url)

  const ref = React.useRef<ICarouselInstance>(null);

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const toggleFavorite = (index: number) => {
    // setVerses((prev) =>
    //   prev.map((verse, i) =>
    //     i === index ? { ...verse, ['favorited']: !verse.['favorited'] } : verse
    //   )
    // );
  };

  const fetchVerses = async () => {
    debugger
    // if(fetchUrl.length > 0 ){
    try {
      
      const token = await AsyncStorage.getItem('token');
      
       const url2 = url.length > 0 ? url : "http://127.0.0.1:3000/api/v1/verses/search?category";

      const response = await axios.get(url2, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // debugger 
      setVerses(response["data"]["verses"])
      
    } catch (e) {
      // debugger
      console.error('Fetch verses failed', e);  
    }
    // }else{
    //   // setVerses([])
    // }

  };

  // useEffect maybe this is not getin gtrri
useEffect(() => {
  debugger
  fetchVerses();
}, [url]);  // Add url as a dependency

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/bg.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Optional overlay for better text readability */}
        <View  />
        {/* conditional display of instructions if verses is empty */}

        <Carousel
          ref={ref}
          width={width}
          height={width}
          data={verses}
          loop={true}
          autoPlay={false}
          defaultIndex={active}
          style={{ width: '100%' }}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <ScrollView
                style={{
                  paddingHorizontal: 20,
                  flex: 1,
                }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              >
                <Text style={styles.verseText}>{`${item['text']}`}</Text>
              </ScrollView>

              <View style={styles.footer}>
                <View style={styles.reference}>
                  <Text style={styles.bookText}>{item['book']}</Text>
                  <Text style={styles.chapterVerseText}>
                    {item["chapter"]}:{item["verse"]}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleFavorite(index)}
                  style={styles.favoriteButton}
                  accessibilityLabel={item['favorited'] ? 'Unfavorite verse' : 'Favorite verse'}
                  accessibilityRole="button"
                >
                  <AntDesign
                    name={item['favorited'] ? 'heart' : 'hearto'}
                    size={28}
                    color={item['favorited'] ? '#ff6b6b' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

      </ImageBackground>
    </View>
  );
};

export default VerseModule;

const styles = StyleSheet.create({

  card: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  verseText: {
    textAlign: 'center',
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
    lineHeight: 38,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  reference: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    marginRight: 4,
  },
  chapterVerseText: {
    fontSize: 18,
    color: 'white',
  },
  favoriteButton: {
    padding: 8,
  },
});