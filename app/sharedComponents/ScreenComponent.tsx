import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
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
  // Helper function to wrap string/number children in Text component
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      // If child is a string or number, wrap it in Text component (React Native requirement)
      if (typeof child === 'string' || typeof child === 'number') {
        return <Text>{child}</Text>;
      }
      return child;
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      resizeMode="cover"
      style={[styles.screenContainer, style]}
    >
      {processChildren(children)}
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