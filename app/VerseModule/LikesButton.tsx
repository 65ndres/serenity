import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

// Define the navigation stack param list
type RootStackParamList = {
  Liked: undefined; // Add other screens as needed
};

// Type the navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Type the LikesButton component
const LikesButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Liked')}
      style={styles.button}
      accessibilityRole="button"
    >
      {/* <MaterialCommunityIcons name="cross" size={24} color="white" /> */}
      <MaterialIcons name="filter-list" size={25} color="white" />
    </TouchableOpacity>
  );
};

// Type the styles
const styles = {
  button: {
    padding: 5,
    marginRight: 15,
  } as StyleProp<ViewStyle>,
};

export default LikesButton;