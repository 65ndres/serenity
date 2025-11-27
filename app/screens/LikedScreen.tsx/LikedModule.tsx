// import { useColorScheme } from '@/hooks/useColorScheme';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import axios from 'axios';
// import { useFonts } from 'expo-font';
// import React, { useCallback, useState } from 'react';
// import {
//   ActivityIndicator,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   View,
//   ViewStyle
// } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import 'react-native-reanimated';
// import LineItem from './LineItem';

// // Define the navigation stack param list
// type RootStackParamList = {
//   Home: undefined;
//   VerseModule: undefined;
// };

// // Type the navigation prop
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// interface Verse {
//   id: number;
//   book: string;
//   chapter: number;
//   verse: number;
//   text: string;
//   liked?: boolean;
// }

// // Type the Liked component
// const LikedScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   const [verses, setVerses] = useState<Verse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLikedVerses = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = await AsyncStorage.getItem('token');
//       const API_URL = 'http://127.0.0.1:3000/api/v1';
      
//       const response = await axios.get(`${API_URL}/liked`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data) {
//         // Handle both array response and object with verses property
//         const versesData = Array.isArray(response.data) 
//           ? response.data 
//           : response.data.verses || [];
//         setVerses(versesData);
//       }
//     } catch (e) {
//       console.error('Fetch liked verses failed', e);
//       setError('Failed to load liked verses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchLikedVerses();
//       // I might have to create a new likedScreen component to manange that will manage the state and leave this
//       // file only triger a reload on each view
//     }, [])
//   );

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <ImageBackground
//       source={require('../assets/images/bg.jpg')}
//       resizeMode="cover"
//       style={styles.image}
//     >
//       <ScrollView
//         style={{
//           height: 500,
//         }}
//       >
//         <View style={styles.container}>
//           {loading ? (
//             <View style={styles.centerContainer}>
//               <ActivityIndicator size="large" color="white" />
//             </View>
//           ) : error ? (
//             <View style={styles.centerContainer}>
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           ) : verses.length === 0 ? (
//             <View style={styles.centerContainer}>
//               <Text style={styles.emptyText}>No liked verses yet</Text>
//             </View>
//           ) : (
//             verses.map((item) => (
//               <LineItem
//                 key={item.id}
//                 chapter={item.chapter}
//                 verse={item.verse}
//                 text={item.text}
//                 book={item.book}
//                 liked={item.liked}
//               />
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   lineItem: {
//     color: 'blue',
//     justifyContent: 'center',
//     width: '100%',
//     borderColor: 'white' 
//   },
//   container: {
//     justifyContent: 'center',
//     alignContent: 'center',
//     paddingTop: 150,
//     paddingLeft: 30,
//     paddingRight: 30
//   } as ViewStyle,
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 50,
//   } as ViewStyle,
//   errorText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   emptyText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   image: {
//     flex: 1,
//     justifyContent: 'center',
//   } as ViewStyle,
// });

// export default LikedScreen;