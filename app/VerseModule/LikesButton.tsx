import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const LikesButton: React.FC = () => {
  return (
    <TouchableOpacity
      onPress={() => console.log("lol")}
      style={{ padding: 5 }}
      accessibilityRole="button"
    >
      <MaterialCommunityIcons name="cross" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default LikesButton;