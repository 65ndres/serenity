import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
  favorited?: boolean;
}

interface VerseModuleProps {
  data: Verse[];
  active: number;
  url: string; // New prop: background image URL
}

const width = Dimensions.get("window").width;

const VerseModule: React.FC<VerseModuleProps> = ({ data, active, url }) => {
  const [verses, setVerses] = useState<Verse[]>(
    data.map((item) => ({
      ...item,
      liked: item.liked ?? false,
      favorited: item.favorited ?? false,
    }))
  );
debugger
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
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: url }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {/* Optional overlay for better text readability */}
        <View  />

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
                <Text style={styles.verseText}>{`${item.text}`}</Text>
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