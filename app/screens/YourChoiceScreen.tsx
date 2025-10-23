import { AntDesign } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';
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
  ];


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

// this shoulkd receive an filter object 
// filter = {screen: "Liked", active: id}
//{}

/// Even better we are gonna have require q search prop and and optional 'active' which is gonna be
// the first verse is gonna show when it renders

const YourChoiceScreen: React.FC<VerseModuleProps> = ({ data, active }) => {
  // here we are gonna see if we neeed
  const [verses, setVerses] = useState<BibleVerse[]>(datas);

  const [selectedLanguage, setSelectedLanguage] = useState();
  const [value, setValue] = useState("Item 1");
 
  const [verseComponentVisibility, setVerseComponentVisibility] = useState(true)

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
      {verseComponentVisibility &&
      
        <Carousel
        ref={ref}
        width={width}
        height={width}
        data={verses}
        loop={true}
        autoPlay={false} // Set to true if you want auto-scrolling
        
        style={{ width: '100%' }}
          renderItem={({ item, index }) => (
            <View>
              <ScrollView
                style={{
                    paddingHorizontal: 15,
                    height: width - 200,
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 30, color: 'white' }}>{`"${item.text}"`}</Text>

              </ScrollView>
              <View style={{display: "flex", alignItems: 'center', paddingTop: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20}}>
                  <Text style={{ fontSize: 20, color: 'white' }}>{item.book} </Text>
                  <Text style={{ fontSize: 20, color: 'white' }}>{item.chapter} : </Text>
                  <Text style={{ fontSize: 20, color: 'white' }}>{item.verse}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(index)}
                    style={{ padding: 5}}
                    accessibilityLabel={item.favorited ? 'Unfavorite verse' : 'Favorite verse'}
                    accessibilityRole="button"
                  >
                    <AntDesign
                      name={item.favorited ? 'heart' : 'hearto'}
                      size={30}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
      />}</View>
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


