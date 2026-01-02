import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { API_URL } from '../../constants/Config';
import ScreenComponent from '../sharedComponents/ScreenComponent';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  Conversations: undefined;
  NewConversation: undefined;
  Conversation: {
    other_user_id?: number;
    conversation_id?: number;
  };
};

// Type the navigation prop
type NavigationProp = DrawerNavigationProp<RootStackParamList>;

interface Conversation {
  id: number;
  conversation_name?: string;
  user_id?: number;
  other_user_id?: number;
  other_user_name?: string;
  other_user_email?: string;
  last_message?: string | { body?: string; sender?: string; verse?: string; time?: string };
  updated_at?: string;
}

// Type the Conversations component
const ConversationsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('token');
      
      // Adjust the endpoint based on your API structure
      const response = await axios.get(`${API_URL}/user/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        // Handle both array response and object with conversations property
        const conversationsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.conversations || [];
        setConversations(conversationsData);
      }
    } catch (e) {
      console.error('Fetch conversations failed', e);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const handleNewConversation = () => {
    navigation.navigate('NewConversation');
  };

  // const handleConversationSelect = (conversation: Conversation) => {
  //   // Navigate to conversation screen with the other_user_id
  //   navigation.navigate('Conversation', {
  //     // other_user_id: user.id,
  //   });
  // };


  return (
    <ScreenComponent>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={{ height: "15%" }}>
        </View>
        <View style={{ height: "65%" }}> 
          <ScrollView
            style={{
              height: '100%',
            }}
          >
            <View style={styles.container}>
            {loading ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : error ? (
              <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : conversations.length === 0 ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No conversations yet</Text>
              </View>
            ) : (
              conversations.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  onPress={() => {
                    // Navigate to conversation screen with other_user_id
                    if (item.id) {
                      navigation.navigate('Conversation', {
                        conversation_id: item.id,
                      });
                    }
                  }}
                >
                  <View style={styles.lineItemContainer}>
                    <View style={styles.conversationInfo}>
                      <Text style={styles.conversationName}>
                        {item.conversation_name}
                      </Text>
                      {(() => {
                        // Handle object with verse and time properties
                        if (item.last_message && typeof item.last_message === 'object') {
                          const verse = item.last_message.verse || '';
                          const time = item.last_message.time || '';
                          
                          return (
                            <View>
                              {verse ? (
                                <Text style={styles.lastMessage}>
                                  {verse.length > 40
                                    ? verse.slice(0, 40) + '...'
                                    : verse}
                                </Text>
                              ) : null}
                              {time ? (
                                <Text style={styles.lastMessageTime}>
                                  {time}
                                </Text>
                              ) : null}
                            </View>
                          );
                        }
                        
                        // Fallback for string format (backward compatibility)
                        if (typeof item.last_message === 'string') {
                          return (
                            <Text style={styles.lastMessage}>
                              {item.last_message.length > 40
                                ? item.last_message.slice(0, 40) + '...'
                                : item.last_message}
                            </Text>
                          );
                        }
                        
                        return null;
                      })()}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
          </ScrollView>
        </View>
        <View style={{ height: "20%" }}>
          <View style={styles.buttonContainer}>
            <Button
              title="New Conversation"
              buttonStyle={styles.newConversationButton}
              titleStyle={styles.buttonTitle}
              onPress={handleNewConversation}
            />
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>Promesas</Text>
          </View>
        </View>
      </Animated.View>
    </ScreenComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  } as ViewStyle,
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  } as ViewStyle,
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  lineItemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 20,
    paddingTop: 20,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 5,
  },
  senderName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 3,
  },
  lastMessage: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  lastMessageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    paddingHorizontal: 50,
    paddingBottom: 10,
  },
  newConversationButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
  },
  buttonTitle: {
    fontWeight: 'bold',
    color: '#ac8861ff',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
});

export default ConversationsScreen;

