import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const LikesButton: React.FC = () => {
  return (
    <TouchableOpacity
      onPress={() => console.log("lol")}
      style={{ padding: 5, marginRight: 15 }}
      accessibilityRole="button"
    >
      {/* <MaterialCommunityIcons name="cross" size={24} color="white" /> */}
      <MaterialIcons name="filter-list" size={25} color="white" />
    </TouchableOpacity>
  );
};

export default LikesButton;