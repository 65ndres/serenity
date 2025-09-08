import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const BackButton: React.FC = () => {
  return (
    <TouchableOpacity
      onPress={() => console.log("lol")}
      style={{ padding: 5 }}
      accessibilityRole="button"
    >
      <Ionicons name="arrow-back-sharp" size={25} color="white" />
    </TouchableOpacity>
  );
};

export default BackButton;