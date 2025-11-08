import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts } from 'expo-font'; // Remove if not using custom fonts
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
  const ref = React.useRef<ICarouselInstance>(null);

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  }); // Remove if not applying the font

  const toggleFavorite = (index: number) => {
    setVerses((prev) =>
      prev.map((verse, i) =>
        i === index ? { ...verse, favorited: !verse.favorited } : verse
      )
    );
    // TODO: Persist via API or AsyncStorage if needed
  };

  const fetchVerses = async () => {
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
  };

  useEffect(() => {
    fetchVerses();
  }, [url]); // Refetch on url change

  // Clamp active to a safe index (handles cases where active > new verses.length - 1)
  const safeIndex = verses.length > 0 ? Math.max(0, Math.min(active, verses.length - 1)) : 0;

  // Optional: After verses update, scroll to safe index if needed (for updates, not mounts)
  useEffect(() => {
    if (ref.current && verses.length > 0) {
      ref.current.scrollTo({ index: safeIndex, animated: false });
    }
  }, [verses, safeIndex]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/bg.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {verses.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20 }}>No verses available</Text>
          </View>
        ) : (
          <Carousel
            ref={ref}
            width={width}
            height={width}
            data={verses}
            loop={true}
            autoPlay={false}
            defaultIndex={safeIndex} // Use clamped index
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
        )}
      </ImageBackground>
    </View>
  );
};

// export default VerseModule;

// styles remain the same

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