import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import 'react-native-reanimated';

import { API_URL } from '../../constants/Config';
import ScreenComponent from '../sharedComponents/ScreenComponent';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  Conversations: undefined;
  NewConversation: undefined;
  Conversation: {
    other_user_id: number;
  };
};

// Type the navigation prop
type NavigationProp = DrawerNavigationProp<RootStackParamList>;
type RouteProp = {
  key: string;
  name: 'Conversation';
  params: RootStackParamList['Conversation'];
};

interface ConversationData {
  id: number;
  other_user?: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  messages: Array<{
    id: number;
    body: string;
    sender_id: number;
    receiver_id: number;
    read: boolean;
    created_at: string;
  }>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface VerseDropdownItem {
  label: string;
  value: Verse;
}

// Type the Conversation component
const ConversationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { other_user_id } = route.params;
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<ConversationData['messages']>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verseDropdownData, setVerseDropdownData] = useState<VerseDropdownItem[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Fetch conversation data and current user ID
  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        
        // Fetch current user ID
        const userResponse = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (userResponse.data?.id) {
          setCurrentUserId(userResponse.data.id);
        }

        // Create or get existing conversation with the selected user
        const conversationResponse = await axios.post(
          `${API_URL}/conversation/new`,
          { other_user_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (conversationResponse.data) {
          setConversationData(conversationResponse.data);
          setMessages(conversationResponse.data.messages || []);
        }
      } catch (e) {
        console.error('Failed to fetch conversation data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchConversationData();
  }, [other_user_id]);

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Debounced verse search - search as user types in dropdown
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Search for verses when user types at least 2 characters
    if (text.trim().length >= 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        searchVerses(text.trim());
      }, 500);
    } else {
      setVerseDropdownData([]);
    }
  };

  const searchVerses = async (query: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Search for verses - adjust endpoint as needed
      const response = await axios.get(`${API_URL}/verses/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query },
      });

      if (response.data) {
        const versesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.verses || [];
        
        // Convert verses to dropdown format
        const dropdownData: VerseDropdownItem[] = versesData.map((verse: Verse) => ({
          label: `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`,
          value: verse,
        }));
        setVerseDropdownData(dropdownData);
      }
    } catch (e) {
      console.error('Search verses failed', e);
      setVerseDropdownData([]);
    }
  };

  const handleVerseSelect = (item: VerseDropdownItem) => {
    setSelectedVerse(item.value);
    setSearchQuery(item.label);
  };

  const handleSendVerse = async () => {
    if (!selectedVerse || !currentUserId || !conversationData) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const verseText = `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse} - ${selectedVerse.text}`;
      
      const response = await axios.post(
        `${API_URL}/conversations/${conversationData.id}/messages`,
        { body: verseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        // Add new message to the list
        setMessages((prev) => [...prev, response.data.message || response.data]);
        setSearchQuery('');
        setSelectedVerse(null);
        setVerseDropdownData([]);
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (e) {
      console.error('Send verse failed', e);
    }
  };


  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    const isSent = item.sender_id === currentUserId;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isSent ? styles.sentMessageBubble : styles.receivedMessageBubble,
          ]}
        >
          <Text style={[styles.messageText, isSent && styles.sentMessageText]}>
            {item.body}
          </Text>
          <Text style={[styles.messageTime, isSent && styles.sentMessageTime]}>
            {new Date(item.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (!loaded) {
    return null;
  }

  const otherUserName = conversationData?.other_user 
    ? `${conversationData.other_user.first_name || ''} ${conversationData.other_user.last_name || ''}`.trim() || conversationData.other_user.username
    : 'Unknown User';

  if (loading) {
    return (
      <ScreenComponent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>Loading conversation...</Text>
        </View>
      </ScreenComponent>
    );
  }

  return (
    <ScreenComponent>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={{ height: "15%" }}>

        </View>
        <View style={{ height: "65%" }}>
          <View style={styles.container}>
            {/* Messages List */}
            <View style={styles.messagesContainer}>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                inverted={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            </View>

             {/* Verse Search Dropdown */}
             <View style={styles.dropdownContainer}>
               <Dropdown
                 style={styles.dropdown}
                 placeholderStyle={styles.placeholderStyle}
                 selectedTextStyle={styles.selectedTextStyle}
                 inputSearchStyle={styles.inputSearchStyle}
                 iconStyle={styles.iconStyle}
                 itemTextStyle={styles.itemTextStyle}
                 data={verseDropdownData}
                 maxHeight={screenHeight * 0.3}
                 autoScroll={false}
                 activeColor="rgba(255, 255, 255, 0.1)"
                 labelField="label"
                 valueField="value"
                 placeholder="Search for verses..."
                 search
                 searchPlaceholder="Type to search..."
                 value={selectedVerse ? { label: searchQuery, value: selectedVerse } : null}
                 onChange={handleVerseSelect}
                 onChangeText={handleSearchChange}
                 containerStyle={styles.dropdownListContainer}
               />
             </View>

             {/* Send Button */}
             {selectedVerse && (
               <View style={styles.sendButtonContainer}>
                 <Button
                   title="Send Verse"
                   buttonStyle={styles.sendButton}
                   titleStyle={styles.sendButtonTitle}
                   onPress={handleSendVerse}
                 />
               </View>
             )}
          </View>
        </View>
        <View style={{ height: "20%" }}>
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
    height: "65%",
    justifyContent: 'flex-end',
  } as ViewStyle,
  messagesContainer: {
    // flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  } as ViewStyle,
  messagesList: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 10,
  } as ViewStyle,
  sentMessageContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  receivedMessageContainer: {
    alignItems: 'flex-start',
  } as ViewStyle,
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  } as ViewStyle,
  sentMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomRightRadius: 4,
  } as ViewStyle,
  receivedMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomLeftRadius: 4,
  } as ViewStyle,
  messageText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  sentMessageText: {
    color: '#333',
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  sentMessageTime: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
  dropdownContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  } as ViewStyle,
  dropdown: {
    height: screenHeight * 0.06,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'white',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    color: 'white',
    fontSize: 16,
  },
  dropdownListContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  sendButtonContainer: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  } as ViewStyle,
  sendButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
  } as ViewStyle,
  sendButtonTitle: {
    fontWeight: 'bold',
    color: '#ac8861ff',
  },
});

export default ConversationScreen;

