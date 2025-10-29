import axios from 'axios';
// import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
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


const datas = [
  {
    book: "Proverbs",
    chapter: 16,
    verse: 3,
    liked: false,
    favorited: false,
    text: "Commit to the Lord whatever you do, and he will establish your plans."
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    liked: false,
    favorited: false,
    text: "I can do all this through him who gives me strength."
  },
  {
    book: "James",
    chapter: 1,
    verse: 5,
    liked: false,
    favorited: false,
    text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."
  },
  {
    book: "Colossians",
    chapter: 3,
    verse: 23,
    liked: false,
    favorited: false,
    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
  },
  {
    book: "Ecclesiastes",
    chapter: 9,
    verse: 10,
    liked: false,
    favorited: false,
    text: "Whatever your hand finds to do, do it with all your might, for in the realm of the dead, where you are going, there is neither working nor planning nor knowledge nor wisdom."
  },
  {
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    liked: false,
    favorited: false,
    text: "Trust in the Lord with all your heart and lean not on your own understanding."
  },
  {
    book: "Galatians",
    chapter: 6,
    verse: 9,
    liked: false,
    favorited: false,
    text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."
  },
  {
    book: "Matthew",
    chapter: 7,
    verse: 7,
    liked: false,
    favorited: false,
    text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
  },
  {
    book: "Psalm",
    chapter: 90,
    verse: 17,
    liked: false,
    favorited: false,
    text: "May the favor of the Lord our God rest on us; establish the work of our hands for us—yes, establish the work of our hands."
  },
  {
    book: "Romans",
    chapter: 12,
    verse: 2,
    liked: false,
    favorited: false,
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will."
  }
];

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

const categories = {
  "acceptance": "acceptance",
  "adoption": "adoption",
  "anxiety": "anxiety",
  "assurance": "assurance",
  "belief": "belief",
  "blessings": "blessings",
  "boldness": "boldness",
  "change": "change",
  "comfort": "comfort",
  "confidence": "confidence",
  "contentment": "contentment",
  "courage": "courage",
  "delight": "delight",
  "deliverance": "deliverance",
  "depression": "depression",
  "encouragement": "encouragement",
  "eternity": "eternity",
  "faith": "faith",
  "faithfulness": "faithfulness",
  "fear": "fear",
  "forgiveness": "forgiveness",
  "freedom": "freedom",
  "friendship": "friendship",
  "generosity": "generosity",
  "goodness": "goodness",
  "grace": "grace",
  "gratitude": "gratitude",
  "grief": "grief",
  "guidance": "guidance",
  "guilt": "guilt",
  "health": "health",
  "honesty": "honesty",
  "hope": "hope",
  "humility": "humility",
  "identity": "identity",
  "inspiration": "inspiration",
  "joy": "joy",
  "kindness": "kindness",
  "loneliness": "loneliness",
  "love": "love",
  "patience": "patience",
  "peace": "peace",
  "perseverance": "perseverance",
  "praise": "praise",
  "prayer": "prayer",
  "protection": "protection",
  "provision": "provision",
  "purpose": "purpose",
  "relationships": "relationships",
  "reliability": "reliability",
  "respect": "respect",
  "restoration": "restoration",
  "reward": "reward",
  "safety": "safety",
  "salvation": "salvation",
  "satisfaction": "satisfaction",
  "serving": "serving",
  "strength": "strength",
  "stress": "stress",
  "support": "support",
  "sustenance": "sustenance",
  "trust": "trust",
  "truth": "truth",
  "understanding": "understanding",
  "victory": "victory",
  "weakness": "weakness",
  "wisdom": "wisdom",
  "worry": "worry"
}

const YourChoiceScreen: React.FC<VerseModuleProps> = ({ data, active }) => {
  // here we are gonna see if we neeed
  const [verses, setVerses] = useState<BibleVerse[]>(datas);

  const [value, setValue] = useState("Item 1");
 
  const [verseComponentVisibility, setVerseComponentVisibility] = useState(true)

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

    useEffect(() => {
      // getVerses
      const fetchVerses = async () => {
      try {
        const response = await axios.get(`${API_URL}/verses/search?category=`);
        debugger
      } catch (e) {
        console.error('Fetch verses failed', e);
        // setError('Failed to load verses. Please try again.');
      } finally {
        // setLoading(false);
      }
    };
    fetchVerses();
    })

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
          data={datos}
          maxHeight={300}
          autoScroll={false}
          activeColor="transparent"
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          containerStyle={styles.containerss}
          onFocus={toggleVerseComponent}
          onBlur={toggleVerseComponent}
          iconColor={'transparent'}
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
        /> 
      </View>
      </View>
      <View style={{height: '60%'}}>
{verseComponentVisibility && <VerseModule data={[]} active={0}/>}
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


