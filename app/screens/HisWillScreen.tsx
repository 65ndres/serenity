import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import VerseModule from '../VerseModule/VerseModule';
import ScreenComponent from '../sharedComponents/ScreenComponent';

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
  data: Verse[];
  active: number;
}


const HisWillScreen: React.FC<VerseModuleProps> = ({ data, active }) => {

  const [verses, setVerses] = useState<Verse[]>([]);
  
  const toggleFavorite = (index: number) => {
    setVerses((prev) =>
      prev.map((verse, i) =>
        i === index ? { ...verse, favorited: !verse.favorited } : verse
      )
    );
  };
  const API_URL = 'http://127.0.0.1:3000/api/v1/verses/search?category=his_will'; 

  return (
    <ScreenComponent>
    <View style={{height: '80%'}}>
      <View style={styles.filter}> </View>       
        <VerseModule data={[]} active={4} url={API_URL} />
    </View>
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
  }
});


