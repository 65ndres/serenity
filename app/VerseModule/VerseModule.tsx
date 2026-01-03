import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';
import { API_URL } from '../../constants/Config';

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

const { width, height } = Dimensions.get("window");

const VerseModule: React.FC<VerseModuleProps> = ({ data, active, url }) => {
  const [verses, setVerses] = useState<Verse[]>([]); // Type it for clarity
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0) // Track current carousel index
  const [isInitialLoad, setIsInitialLoad] = useState(true) // Track if this is the first load

  const ref = React.useRef<ICarouselInstance>(null);

  const toggleLike = async (index: number) => {
    const verse = verses[index];
    if (!verse || !verse.id) return;

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Optimistically update the UI
    const previousLikedState = verse.liked;
    setVerses((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, liked: !v.liked } : v
      )
    );

    try {
      const token = await AsyncStorage.getItem('token');
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
          // Don't change currentIndex - maintain user's position
          setVerses((prev) => [...prev, ...response.data.verses]);
        } else {
          // Replace verses when loading first page or new category
          setVerses(response.data.verses);
          // Reset to initial active index when loading new category
          const initialIndex = response.data.verses.length > 0 
            ? Math.max(0, Math.min(active, response.data.verses.length - 1)) 
            : 0;
          setCurrentIndex(initialIndex);
          setIsInitialLoad(true);
          
          // Scroll to initial index after verses are set (use setTimeout to ensure carousel is rendered)
          setTimeout(() => {
            if (ref.current && response.data.verses.length > 0) {
              const safeIndex = Math.max(0, Math.min(initialIndex, response.data.verses.length - 1));
              ref.current.scrollTo({ index: safeIndex, animated: false });
              setIsInitialLoad(false);
            }
          }, 0);
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
      setCurrentIndex(0);
      setIsInitialLoad(true);
      fetchVerses(url, 1, false);
    } else if (data.length > 0) {
      setVerses(data);
      setCurrentIndex(0);
      // setIsInitialLoad(true);
    }
  }, [url])

  const onChange = (index: number) => {
    // Update current index as user scrolls
    setCurrentIndex(index);
    
    // Load more when user is 2 items away from the end
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
        {url.length === 0 && verses.length === 0 ? (
          <View >
            <View style={{width: '100%'}}>
              <View style={{display: 'flex', alignItems: 'flex-end', paddingTop: height * 0.025}}>

                  <Text style={{ color: 'white', fontSize: height * 0.027, textAlign: 'center', alignSelf: 'center', fontWeight: '300', fontStyle: 'italic' }}>
                  "Search for the LORD and for his strength..."
                  </Text>
              </View>
            </View>
        </View>
        ) : (
          <View style={{ flex: 1 }}>
          <Carousel
            ref={ref}
            width={width * 0.84} // scales with screen width (~84% of screen width, equivalent to width - 60 on 375px screen)
            height={width}
            data={verses}
            loop={false}
            autoPlay={false}
            onScrollEnd={onChange}
            defaultIndex={currentIndex} // Use current tracked index
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <ScrollView
                  style={{
                    flex: 1,
                  }}
                  contentContainerStyle={{justifyContent: 'flex-start' }}
                >
                  <View style={{width: '100%'}}>
                    <Text style={styles.verseText}>{item.text}</Text>
                  </View>
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
                    <FontAwesome
                      name={(item.liked ? 'heart' : 'heart-o') as any}
                      size={height * 0.034}
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
    paddingTop: height * 0.025, // scales with screen height (~2.5% of screen height)
    justifyContent: 'space-between',
    textAlign: 'center',
    // paddingRight: 30,
    // paddingLeft: 30,
  },
  verseText: {
    textAlign: 'center',
    fontSize: height * 0.034, // scales with screen height (~3.4% of screen height)
    color: 'white',
    fontWeight: '300',
    lineHeight: height * 0.047, // scales with screen height (~4.7% of screen height)
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: height * 0.025, // scales with screen height (~2.5% of screen height)
  },
  reference: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookText: {
    fontSize: height * 0.022, // scales with screen height (~2.2% of screen height)
    color: 'white',
    fontWeight: '400',
    marginRight: width * 0.011, // scales with screen width (~1.1% of screen width)
  },
  chapterVerseText: {
    fontSize: height * 0.022, // scales with screen height (~2.2% of screen height)
    color: 'white',
  },
  favoriteButton: {
    padding: width * 0.021, // scales with screen width (~2.1% of screen width)
  },
});