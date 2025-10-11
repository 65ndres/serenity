import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
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
interface ScreenComponentProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

const ScreenComponent: React.FC<ScreenComponentProps> = ({ children, style }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      resizeMode="cover"
      style={[styles.screenContainer, style]}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    height:'100%',
    justifyContent: 'center',
    flex: 1,
    width: width,
    paddingLeft: 40,
    paddingRight: 40,
    maxWidth: 400
  }
  })
export default ScreenComponent;