import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
}

interface PaginationMetadata {
  page: number;
  pages: number;
  next?: number | null;
  prev?: number | null;
  count: number;
  items: number;
  last: number;
}

interface VerseModuleProps {
  data: Verse[]; // Unused? Consider removing if always fetching
  active: number;
  url: string;
}

const width = Dimensions.get("window").width;

const VerseModule: React.FC<VerseModuleProps> = ({ data, active, url }) => {
  const [verses, setVerses] = useState<Verse[]>([]); // Type it for clarity
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null)
  const [loading, setLoading] = useState(false)

  const ref = React.useRef<ICarouselInstance>(null);

  const toggleLike = async (index: number) => {
    const verse = verses[index];
    if (!verse || !verse.id) return;

    // Optimistically update the UI
    const previousLikedState = verse.liked;
    setVerses((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, liked: !v.liked } : v
      )
    );

    try {
      const token = await AsyncStorage.getItem('token');
      const API_URL = 'http://127.0.0.1:3000/api/v1';
      await axios.post(
        `${API_URL}/verses/${verse.id}/toggle_like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      // Revert on error
      console.error('Toggle like failed', e);
      setVerses((prev) =>
        prev.map((v, i) =>
          i === index ? { ...v, liked: previousLikedState } : v
        )
      );
    }
  };

  const fetchVerses = async (fetchUrl: string, page: number, append: boolean = false) => {
    if (fetchUrl.length === 0) return;

    if (loading) return; // Prevent multiple simultaneous requests

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      // Add page parameter to URL (handle both cases: with or without existing query params)
      const separator = fetchUrl.includes('?') ? '&' : '?';
      const urlWithPage = `${fetchUrl}${separator}page=${page}`;
      
      const response = await axios.get(urlWithPage, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.verses && response.data.pagination) {
        if (append) {
          // Append new verses when loading more pages
          setVerses((prev) => [...prev, ...response.data.verses]);
        } else {
          // Replace verses when loading first page or new category
          setVerses(response.data.verses);
        }
        
        setPagination(response.data.pagination);
        setCurrentPage(page);
      }
    } catch (e) {
      console.error('Fetch verses failed', e);
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch first page when URL changes
  useEffect(() => {
    if (url.length > 0) {
      setVerses([]);
      setCurrentPage(1);
      setPagination(null);
      fetchVerses(url, 1, false);
    }
  }, [url])

  const safeIndex = verses.length > 0 ? Math.max(0, Math.min(active, verses.length - 1)) : 0;

  useEffect(() => {
    if (ref.current && verses.length > 0) {
      ref.current.scrollTo({ index: safeIndex, animated: false });
    }
  }, [verses, safeIndex, url]);

  const onChange = (index: number) => {
    // Load more when user is 5 items away from the end
    console.log(index)
    const itemsLeft = verses.length - (index + 1);
    if (itemsLeft <= 2 && pagination && pagination.next) {
      // Check if there's a next page and we're not already loading
      if (!loading && currentPage < pagination.pages) {
        fetchVerses(url, pagination.next, true);
      }
    }
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
                    onPress={() => toggleLike(index)}
                    style={styles.favoriteButton}
                    accessibilityLabel={item.liked ? 'Unlike verse' : 'Like verse'}
                    accessibilityRole="button"
                  >
                    <AntDesign
                      name={item.liked ? 'heart' : 'hearto'}
                      size={28}
                      color={item.liked ? 'white' : 'white'}
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