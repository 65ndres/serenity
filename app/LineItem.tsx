import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LineItemProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  liked?: boolean;
  favorited?: boolean;
}

type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

// Type the navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const LineItem: React.FC<LineItemProps> = ({ book, chapter, verse, text }) => {
  const navigation = useNavigation<NavigationProp>();
  // Get initial of the book
  const bookInitial = book.charAt(0).toUpperCase();
  
  // Truncate text to a reasonable length (e.g., 50 characters) for display
  const truncatedText = text.length > 30 ? `${text.substring(0, 20)}...` : text;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('VerseModule')}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {`${bookInitial}. ${chapter}:${verse}  `}
        </Text>
        <Text style={styles.text}>
            {truncatedText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    paddingBottom: 20,
    paddingTop: 20,
  },
  text: {
    color: 'white', // Adjust text color as needed
    fontSize: 20,   // Adjust font size as needed
  },
});

export default LineItem;