import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
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

  const updateUrl = (category: string) => {
    setUrl(`${API_URL}/verses/search?category=${category}`)
  };

  const toggleVerseComponent = () => {
    setVerseComponentVisibility(!verseComponentVisibility)
  }

  return (
    <>
      <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      itemTextStyle={{ color: 'white', textAlign: 'center', fontSize: 20 }}
      data={categoriesToList}
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
      onChange={item => {
        updateUrl(item.value);
      } } />

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
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
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

// MVP: make sure it renders