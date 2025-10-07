import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';

const width = Dimensions.get("window").width;
// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  VerseModule: undefined;
};

// Type the navigation prop

// Type the Home component
interface ScreenContainerProps {
  children?: React.ReactNode; // Allows any valid React node (components, text, etc.)
  style?: ViewStyle; // Optional style prop for View
}

const ScreenComponent: React.FC<ScreenContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.screenContainer, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    height:'100%',
    justifyContent: 'center',
    flex: 1,
    width: width,
    padding: 20}
  })
export default ScreenComponent;