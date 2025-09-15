import Ionicons from '@expo/vector-icons/Ionicons';
// import { NavigationAction } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const BackButton: React.FC = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
    onPress={() => navigation.goBack()}
      style={{ padding: 5, marginLeft: 15 }}
      accessibilityRole="button"
    >
      <Ionicons name="arrow-back-sharp" size={25} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;