import axios from 'axios';
// import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import VerseModule from '../VerseModule/VerseModule';
// import { Dropdown } from 'react-native-element-dropdown';
  // import AntDesign from '@expo/vector-icons/AntDesign';
  // import { Picker } from '@react-native-picker/picker';a

  const datos = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ]; // This can be store 


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

// const categoriesToList = [
//   { label: 'acceptance', value: 'acceptance' },
//   { label: 'adoption', value: 'adoption' },
//   { label: 'anxiety', value: 'anxiety' },
//   { label: 'assurance', value: 'assurance' },
//   { label: 'belief', value: 'belief' },
//   { label: 'blessings', value: 'blessings' },
//   { label: 'boldness', value: 'boldness' },
//   { label: 'change', value: 'change' },
//   { label: 'comfort', value: 'comfort' },
//   { label: 'confidence', value: 'confidence' },
//   { label: 'contentment', value: 'contentment' },
//   { label: 'courage', value: 'courage' },
//   { label: 'delight', value: 'delight' },
//   { label: 'deliverance', value: 'deliverance' },
//   { label: 'depression', value: 'depression' },
//   { label: 'encouragement', value: 'encouragement' },
//   { label: 'eternity', value: 'eternity' },
//   { label: 'faith', value: 'faith' },
//   { label: 'faithfulness', value: 'faithfulness' },
//   { label: 'fear', value: 'fear' },
//   { label: 'forgiveness', value: 'forgiveness' },
//   { label: 'freedom', value: 'freedom' },
//   { label: 'friendship', value: 'friendship' },
//   { label: 'generosity', value: 'generosity' },
//   { label: 'goodness', value: 'goodness' },
//   { label: 'grace', value: 'grace' },
//   { label: 'gratitude', value: 'gratitude' },
//   { label: 'grief', value: 'grief' },
//   { label: 'guidance', value: 'guidance' },
//   { label: 'guilt', value: 'guilt' },
//   { label: 'health', value: 'health' },
//   { label: 'honesty', value: 'honesty' },
//   { label: 'hope', value: 'hope' },
//   { label: 'humility', value: 'humility' },
//   { label: 'identity', value: 'identity' },
//   { label: 'inspiration', value: 'inspiration' },
//   { label: 'joy', value: 'joy' },
//   { label: 'kindness', value: 'kindness' },
//   { label: 'loneliness', value: 'loneliness' },
//   { label: 'love', value: 'love' },
//   { label: 'patience', value: 'patience' },
//   { label: 'peace', value: 'peace' },
//   { label: 'perseverance', value: 'perseverance' },
//   { label: 'praise', value: 'praise' },
//   { label: 'prayer', value: 'prayer' },
//   { label: 'protection', value: 'protection' },
//   { label: 'provision', value: 'provision' },
//   { label: 'purpose', value: 'purpose' },
//   { label: 'relationships', value: 'relationships' },
//   { label: 'reliability', value: 'reliability' },
//   { label: 'respect', value: 'respect' },
//   { label: 'restoration', value: 'restoration' },
//   { label: 'reward', value: 'reward' },
//   { label: 'safety', value: 'safety' },
//   { label: 'salvation', value: 'salvation' },
//   { label: 'satisfaction', value: 'satisfaction' },
//   { label: 'serving', value: 'serving' },
//   { label: 'strength', value: 'strength' },
//   { label: 'stress', value: 'stress' },
//   { label: 'support', value: 'support' },
//   { label: 'sustenance', value: 'sustenance' },
//   { label: 'trust', value: 'trust' },
//   { label: 'truth', value: 'truth' },
//   { label: 'understanding', value: 'understanding' },
//   { label: 'victory', value: 'victory' },
//   { label: 'weakness', value: 'weakness' },
//   { label: 'wisdom', value: 'wisdom' },
//   { label: 'worry', value: 'worry' }
// ];

const categoriesToList = [
    { label: 'Anxiety', value: 'Anxiety' },
    { label: 'Acceptance', value: 'Acceptance' },
  { label: 'Belief', value: 'Belief' },
  { label: 'Blessings', value: 'Blessings' },
  { label: 'Courage', value: 'Courage' },
]

// anxiety_tag = Tag.find_or_create_by(name: 'Anxiety')
// acceptance_tag = Tag.find_or_create_by(name: 'Acceptance')
// belief_tag = Tag.find_or_create_by(name: 'Belief')
// blessings_tag = Tag.find_or_create_by(name: 'Blessings')
// confidence_tag = Tag.find_or_create_by(name: 'Confidence')
// courage_tag = Tag.find_or_create_by(name: 'Courage')
const YourChoiceScreen: React.FC<VerseModuleProps> = ({ data, active }) => {
  // here we are gonna see if we neeed
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [categories, setCategories] = useState(categoriesToList);
  // category should useSTate
  // const categoryS
// 
  // let selecteed = category ? category : categories[0]["label"]

  
//  this gets tag one we click bc Im changing the state so it rerenders
// Bc Im changing the state to hide or show the verse component

  const [verseComponentVisibility, setVerseComponentVisibility] = useState(true)

  const [pageNumber, setpageNumber] = useState("1");

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

  const fetchVerses = async (category: string) => {
    try {
      const response = await axios.get(`${API_URL}/verses/search?category=${category}`);

      let verses = response["data"]["verses"];
      let pageNumber = response["data"]["pagination"]["page"];

      setVerses(verses);
      setpageNumber(pageNumber);  // Safe now—no loop!

    } catch (e) {
      console.error('Fetch verses failed', e);  
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/bg.jpg")} resizeMode="cover" style={styles.image}>
      <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{height: '20%'}}>
        
        <View style={{display: 'flex', justifyContent: 'center', height: "100%"}}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{color: 'white', textAlign: 'center', fontSize: 20}}
          data={categories}
          maxHeight={300}
          autoScroll={false}
          activeColor="transparent"
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          containerStyle={styles.containerss}
          // onFocus={toggleVerseComponent}
          // onBlur={toggleVerseComponent}
          iconColor={'transparent'}
          onChange={item => {
            fetchVerses(item.value);
          }}
        /> 
      </View>
      </View>
      <View style={{height: '60%'}}>
          {verseComponentVisibility && <VerseModule data={verses} url={"sinevt"} active={0}/>}
      </View>
    </View>
  </ImageBackground>);
  
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


