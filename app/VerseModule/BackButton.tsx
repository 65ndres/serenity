import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface BackButtonProps {
  text: string;
  onPress?: () => void; // Optional custom onPress handler
}

const BackButton: React.FC<BackButtonProps> = ({ text, onPress }) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ padding: 5, marginLeft: 15 }}
      accessibilityRole="button"
    >
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Ionicons name="arrow-back-sharp" size={25} color="white" />
        <Text style={{ color: 'white', paddingLeft: 10, fontSize: 20 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BackButton;