import Feather from '@expo/vector-icons/Feather';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { API_URL } from '../../constants/Config';
import VerseModule from '../VerseModule/VerseModule';

// interface BackButtonProps {
//   text: string;
// }

const categoriesToList = [
  { label: 'Anxiety', value: 'Anxiety' },
  { label: 'Acceptance', value: 'Acceptance' },
  { label: 'Belief', value: 'Belief' },
  { label: 'Blessings', value: 'Blessings' },
  { label: 'Courage', value: 'Courage' },
]

const YourChoiceContent: React.FC = () => {
  
  const [verseComponentVisibility, setVerseComponentVisibility] = useState(true)
  const [url, setUrl] = useState("")
  const dropdownRef = useRef<any>(null)

  const updateUrl = (category: string) => {
    setUrl(`${API_URL}/verses/search?category=${category}`)
  };

  const toggleVerseComponent = () => {
    setVerseComponentVisibility(!verseComponentVisibility)
  }

  const handleChevronPress = () => {
    // Trigger dropdown by focusing it programmatically
    if (dropdownRef.current) {
      // Try to open the dropdown - the ref might have different methods
      // If open() doesn't work, we can use a workaround
      try {
        dropdownRef.current.open?.();
      } catch (e) {
        // Alternative: focus the dropdown input
        dropdownRef.current.focus?.();
      }
    }
  }

  return (
    <>
      <View style={styles.dropdownContainer}>
        <Dropdown
          ref={dropdownRef}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: '300' }}
          data={categoriesToList}
          maxHeight={300}
          autoScroll={false}
          activeColor="transparent"
          labelField="label"
          valueField="value"
          placeholder="Select a category"
          containerStyle={styles.containerss}
          onFocus={toggleVerseComponent}
          onBlur={toggleVerseComponent}
          iconColor={'transparent'}
          onChange={item => {
            updateUrl(item.value);
          } } />
      </View>
      {verseComponentVisibility &&
        <View style={styles.chevronContainer}>
          <Pressable onPress={handleChevronPress}>
            <Feather name="chevron-down" size={25} color="white" />
          </Pressable>
        </View>}
  
        {verseComponentVisibility && <VerseModule data={[]} active={4} url={url} />}
    </>
  );
};

export default YourChoiceContent;

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
  dropdownContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    textAlign: 'center',
    borderWidth: 0,
    width: '100%',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '300',
  },
  selectedTextStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '300',
    // fontStyle: 'italic',
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

// MVP: make sure it renders