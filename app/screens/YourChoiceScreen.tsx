import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import ScreenComponent from '../sharedComponents/ScreenComponent';
import YourChoiceContent from '../sharedComponents/YourChoiceContent';


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

const categoriesToList = [
  { label: 'Anxiety', value: 'Anxiety' },
  { label: 'Acceptance', value: 'Acceptance' },
  { label: 'Belief', value: 'Belief' },
  { label: 'Blessings', value: 'Blessings' },
  { label: 'Courage', value: 'Courage' },
]

const YourChoiceScreen: React.FC<VerseModuleProps> = ({ data, active }) => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [verseComponentVisibility, setVerseComponentVisibility] = useState(true)

  // const [pageNumber, setpageNumber] = useState("1");

  const API_URL = 'http://127.0.0.1:3000/api/v1';

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

  const toggleVerseComponent = () => {
    setVerseComponentVisibility(!verseComponentVisibility)
  }


  return (
    <ScreenComponent>
      <View style={{height: '80%'}}>        
        <YourChoiceContent></YourChoiceContent>
      </View>
    </ScreenComponent>
  
);
  
};

export default YourChoiceScreen;



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
    dropdown: {
      margin: 16,
      height: 50,
      backgroundColor: 'transparent',
      textAlign: 'center',
      borderWidth: 0
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 25,
      color: 'white',
      textAlign: 'center'
    },
    iconStyle: {
      color: 'transparent',
      display: 'none'
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    containerss: {
      backgroundColor: 'transparent',
      borderWidth: 0
    }
});


