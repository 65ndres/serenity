import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
  favorited?: boolean; // Fixed key name for consistency
}

interface VerseModuleProps {
  data: Verse[]; // Unused? Consider removing if always fetching
  active: number;
  url: string;
}

const width = Dimensions.get("window").width;

const VerseModule: React.FC<VerseModuleProps> = ({ data, active, url }) => {
  const [verses, setVerses] = useState<Verse[]>([]); // Type it for clarity
  const [pagination, setPagination] = useState(1)
  const [loadMore, setLoadMore] = useState(true)

  const ref = React.useRef<ICarouselInstance>(null);

  const toggleFavorite = (index: number) => {
    setVerses((prev) =>
      prev.map((verse, i) =>
        i === index ? { ...verse, favorited: !verse.favorited } : verse
      )
    );
    // TODO: Persist via API or AsyncStorage if needed
  };

  const fetchVerses = async () => {
    if (url.length > 0){
      try {
        const token = await AsyncStorage.getItem('token');
        const url2 = url.length > 0 ? url : "http://127.0.0.1:3000/api/v1/verses/search?category";
        const response = await axios.get(url2, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVerses(response.data.verses);
      } catch (e) {
        console.error('Fetch verses failed', e);
      }
    }
  };

  useEffect(() => {
    fetchVerses();
  }, [url])

  const safeIndex = verses.length > 0 ? Math.max(0, Math.min(active, verses.length - 1)) : 0;

  useEffect(() => {
    if (ref.current && verses.length > 0) {
      ref.current.scrollTo({ index: safeIndex, animated: false });
    }
  }, [verses, safeIndex, url]);


  const onChange = (index: any) => {
    // debugger
    // conos
    if((verses.length - index) === 1){ // in three or less left then make the call 
      console.log("Wogooo")
    }
    console.log(verses.length - index)
  }

  return (
    
    <View>
        {url.length === 0 ? (
          <View style={{ flex: 1, display: 'flex' }}>
            <View style={{width: (width - 80), height: width}}>
              <View style={{display: 'flex', alignItems: 'flex-end'}}>

                  <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>
                    Choose a catergory from above
                  </Text>
              </View>
            </View>
        </View>
        ) : (
          <View style={{ flex: 1 }}>
          <Carousel
            ref={ref}
            width={width - 80} // is 80 to offset the 40 of each side on the screencomponent
            height={width}
            data={verses}
            loop={true}
            autoPlay={false}
            onScrollEnd={onChange}
            defaultIndex={safeIndex} // Use clamped index
            // style={{ width: '100%' }}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <ScrollView
                  style={{
                    paddingHorizontal: 20,
                    flex: 1,
                  }}
                  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                  <Text style={styles.verseText}>{item.text}</Text>
                </ScrollView>

                <View style={styles.footer}>
                  <View style={styles.reference}>
                    <Text style={styles.bookText}>{item.book}</Text>
                    <Text style={styles.chapterVerseText}>
                      {item.chapter}:{item.verse}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleFavorite(index)}
                    style={styles.favoriteButton}
                    accessibilityLabel={item.favorited ? 'Unfavorite verse' : 'Favorite verse'}
                    accessibilityRole="button"
                  >
                    <AntDesign
                      name={item.favorited ? 'heart' : 'hearto'}
                      size={28}
                      color={item.favorited ? '#ff6b6b' : 'white'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          </View>
        )}
    </View>
  );
};

// export default VerseModule;

// styles remain the same

export default VerseModule;

const styles = StyleSheet.create({

  card: {
    flex: 1,
    // padding: 20,
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