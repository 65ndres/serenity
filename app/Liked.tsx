import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import ScreenComponent from './sharedComponents/ScreenComponent';
import BackButton from './VerseModule/BackButton';
import VerseModule from './VerseModule/VerseModule';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

// Type the navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
}

// Type the Liked component
const Liked: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [moduleComponentVisibility, setModuleComponentVisibility] = useState(false);
  const [listComponentVisibility, setListComponentVisibility] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  const fetchLikedVerses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('token');
      const API_URL = 'http://127.0.0.1:3000/api/v1';
      
      const response = await axios.get(`${API_URL}/liked`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        // Handle both array response and object with verses property
        const versesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.verses || [];
        setVerses(versesData);
      }
    } catch (e) {
      console.error('Fetch liked verses failed', e);
      setError('Failed to load liked verses');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (listComponentVisibility) {
        fetchLikedVerses();
      }
    }, [listComponentVisibility])
  );

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const showModule = (verseId: number) => {
    // Find the verse based on the id
    const foundVerse = verses.find(verse => verse.id === verseId);
    
    if (foundVerse) {
      setSelectedVerse(foundVerse);
      setModuleComponentVisibility(true);
      setListComponentVisibility(false);
    } else {
      console.warn('Verse not found with id:', verseId);
    }
  };

  const handleBackPress = () => {
    if (listComponentVisibility) {
      // If showing the list, navigate back to previous screen
      navigation.goBack();
    } else {
      // If showing the module, go back to the list
      setModuleComponentVisibility(false);
      setListComponentVisibility(true);
      setSelectedVerse(null);
    }
  };

  // Set header options dynamically based on listComponentVisibility
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton 
          text={""} 
          onPress={handleBackPress}
        />
      ),
    });
  }, [listComponentVisibility, navigation]);

  return (
    <ScreenComponent>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          style={{
            height: 500,
          }}
        >
          {listComponentVisibility && <View style={styles.container}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : verses.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No liked verses yet</Text>
            </View>
          ) : (
            verses.map((item) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => showModule(item.id)}
              >
                <View style={styles.lineItemContainer}>
                  <Text style={styles.lineItemText}>
                    {`${item.book.charAt(0).toUpperCase() || ''}. ${item.chapter || ''}:${item.verse || ''}  `}
                  </Text>
                  <Text style={{color: 'white', fontSize: 16}}>
                    {item.text
                      ? item.text.length > 30
                        ? item.text.slice(0, 30) + '...'
                        : item.text
                      : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>}
        {moduleComponentVisibility && selectedVerse && 
        <View style={{ height: "100%" }}>
          <View style={{ height: "20%" }}>
          </View>
          <View style={{ height: "60%" }}>
            <VerseModule data={[selectedVerse]} active={4} url={''} />
          </View>
        </View>
        }
        </ScrollView>
      </Animated.View>
    </ScreenComponent>
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
  } as ViewStyle,
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  } as ViewStyle,
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  lineItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    paddingBottom: 20,
    paddingTop: 20,
  },
  lineItemText: {
    color: 'white', // Adjust text color as needed
    fontSize: 16,   // Adjust font size as needed
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
});

export default Liked;