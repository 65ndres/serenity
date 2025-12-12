import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { API_URL } from '../../constants/Config';
import ScreenComponent from '../sharedComponents/ScreenComponent';
import VerseModule from '../VerseModule/VerseModule';

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

const width = Dimensions.get("window").width;

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
  favorited?: boolean;
}

interface VerseModuleProps {
  data?: Verse[];
  active?: number;
}


const HisWillScreen: React.FC<VerseModuleProps> = ({ data, active }) => {

  const [verses, setVerses] = useState<Verse[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value
  
  const toggleFavorite = (index: number) => {
    setVerses((prev) =>
      prev.map((verse, i) =>
        i === index ? { ...verse, favorited: !verse.favorited } : verse
      )
    );
  };
  const API_URL_HIS_WILL = `${API_URL}/verses/search?category=his_will`; 

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);

  return (
    <ScreenComponent>
      <Animated.View style={{opacity: fadeAnim }}>
      <View style={{height: '20%'}}>
      </View>
        <View style={{height: '60%'}}>
          <VerseModule data={[]} url={API_URL_HIS_WILL} active={0} />
        </View>
        <View style={{height: '20%'}}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Image source={require('../../assets/images/splash-icon.png')} style={styles.logoImage} />
          </View>
        </View>
      </Animated.View>
    </ScreenComponent>
  );
};

export default HisWillScreen;


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

  filter: {
    margin: 16,
    height: 50,
    backgroundColor: 'transparent',
    textAlign: 'center',
    borderWidth: 0
  },
  logoImage: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  }
});


