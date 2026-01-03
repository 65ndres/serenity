import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Input } from '@rneui/themed';
import axios from 'axios';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import 'react-native-reanimated';

import { API_URL } from '../../constants/Config';
import ScreenComponent from '../sharedComponents/ScreenComponent';
import BackButton from '../VerseModule/BackButton';
import VerseModule from '../VerseModule/VerseModule';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  Conversations: undefined;
  NewConversation: undefined;
  Conversation: {
    other_user_id?: number,
    conversation_id?: number,
    verse_id?: number,
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
  conversation_name?: string;
  messages: Array<{
    address: string;
    id: number;
    body: string;
    sender_id: number;
    receiver_id: number;
    read: boolean;
    created_at: string;
  }>;
}

interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Type the Conversation component
const ConversationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { other_user_id, conversation_id, verse_id } = route.params || {};
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<ConversationData['messages']>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [verseResults, setVerseResults] = useState<Verse[]>([]);
  const [readyToSend, setReadyToSend] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [seletedVerseId, setSeletedVerseId] = useState<number | null>(null);
  const [moduleComponentVisibility, setModuleComponentVisibility] = useState(false);
  const [listComponentVisibility, setListComponentVisibility] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [verseIdLoaded, setVerseIdLoaded] = useState<boolean>(false);
  
  // Fetch conversation data and current user ID
  const fetchConversationData = useCallback(async () => {
    // I need to make sure this is loading the conversation again after a new message is sent
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const conversationResponse = await axios.post(
        `${API_URL}/conversation/new`,
        { 
          other_user_id: other_user_id || null, 
          conversation_id: conversation_id || conversationData?.id || null 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (conversationResponse.data) {
        // debugger
        setCurrentUserId(conversationResponse.data.current_user_id);
        setConversationData(conversationResponse.data);
        setMessages(conversationResponse.data.messages || []);
      }
    } catch (e) {
      console.error('Failed to fetch conversation data', e);
    } finally {
      setLoading(false);
    }
  }, [other_user_id, conversation_id, conversationData?.id]);

  useFocusEffect(
    useCallback(() => {
      if (listComponentVisibility) {
        fetchConversationData();
      }
    }, [listComponentVisibility, fetchConversationData])
  );

  // Fade-in animation on component mount
  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start();
  // }, [fadeAnim]);

  // Debounced verse search - search as user types
  const handleInputChange = (text: string) => {
    setInputText(text);
    setReadyToSend(false); // Reset readyToSend when user types
    
    // Search for verses when user types at least 2 characters
    if (text.trim().length >= 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        searchVerses(text.trim());
      }, 500);
    } else {
      setVerseResults([]);
    }
  };

  const searchVerses = async (query: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Search for verses - adjust endpoint as needed
      const response = await axios.get(`${API_URL}/verses/search_by_address`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: query },
      });

      if (response.data) {
        const versesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.verses || [];
        setVerseResults(versesData);
      }
    } catch (e) {
      console.error('Search verses failed', e);
      setVerseResults([]);
    }
  };

  const handleVerseSelect = async (verse: Verse) => {
    setInputText(`${verse.book} ${verse.chapter}:${verse.verse}`);
    setSeletedVerseId(verse.id);
    setVerseResults([]);
    setReadyToSend(true);
    // setInputText("");
  };

  const handleSendMessage = async () => {
    // debugger
    if (!inputText.trim() || !readyToSend || !conversationData || !seletedVerseId) return;

    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/conversations/${conversationData.id}/messages`,
        { verse_id: seletedVerseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
// debugger
      if (response.status === 200 || response.status === 201) {
        fetchConversationData();
        // fetchConversationData(conversationData.id);
        setInputText("");
      }
    } catch (e) {
      console.error('Send message failed', e);
    }
  };

  const fetchVerseByAddress = async (address: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/verses/search_by_address`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: address },
      });

      if (response.data) {
        const versesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.verses || [];
        
        if (versesData.length > 0) {
          // Use the first verse from the results
          setSelectedVerse(versesData[0]);
          setModuleComponentVisibility(true);
          setListComponentVisibility(false);
        } else {
          console.warn('No verse found for address:', address);
        }
      }
    } catch (e) {
      console.error('Fetch verse by address failed', e);
    }
  };

  const fetchVerseByInputText = useCallback(async (address: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/verses/search_by_address`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: address },
      });
      debugger
      if (response.data) {
        const verses = response.data.verses || response.data;
        if (verses.length > 0) {
          // Set the verse address in the input
          const verse = verses[0];
          const verseAddress = `${verse.book} ${verse.chapter}:${verse.verse}`;
          setInputText(verseAddress);
          setSeletedVerseId(verse.id);
          setReadyToSend(true);
        }
      }
    } catch (e) {
      console.error('Fetch verse by input text failed', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch verse by ID when verse_id is present in route params
  useEffect(() => {
    if (verse_id && !verseIdLoaded) {
      fetchVerseByInputText(inputText);
      setVerseIdLoaded(true);
    }
  }, [inputText, verseIdLoaded, fetchVerseByInputText]);

  const handleBackPress = () => {
    if (listComponentVisibility) {
      // If showing the list, navigate back to previous screen
      navigation.goBack();
    } else {
      // If showing the module, go back to the list
      setModuleComponentVisibility(false);
      setListComponentVisibility(true);
      setSelectedVerse(null);
    }
  };

  // Set header options dynamically based on listComponentVisibility
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton 
          text={""} 
          onPress={handleBackPress}
        />
      ),
    });
  }, [listComponentVisibility, navigation]);


  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    const isSent = item.sender_id === currentUserId;
    return (
      <TouchableOpacity
        onPress={() => fetchVerseByAddress(item.address)}
        activeOpacity={0.7}
      >
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
              {item.address}
            </Text>
            <Text style={[styles.messageTime, isSent && styles.sentMessageTime]}>
              {new Date(item.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!loaded) {
    return null;
  }

  const otherUserName = conversationData?.conversation_name || "Unknown User";
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
      {/* <Animated.View style={{ opacity: fadeAnim }}> */}
        <View style={{ height: "10%"}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
            <Text style={styles.quoteText}>With</Text>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '600' }}>{otherUserName}</Text>
          </View>
        </View>
        <View style={{ height: "70%" }}>
          {listComponentVisibility && (
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <View style={styles.container}>
                {/* Messages List */}
                {verseResults.length === 0 &&
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
                }
                 {/* Verse Search Results */}
                 {inputText.trim().length >= 2 && verseResults.length > 0 && (
                   <View style={styles.verseResultsContainer}>
                     <FlatList
                       data={verseResults}
                       renderItem={({ item }) => (
                         <TouchableOpacity
                           style={styles.verseResultItem}
                           onPress={() => handleVerseSelect(item)}
                         >
                           <Text style={styles.verseResultText}>
                             {`${item.book} ${item.chapter}:${item.verse}`}
                           </Text>
                           <Text style={styles.verseResultBody} numberOfLines={2}>
                             {item.text}
                           </Text>
                         </TouchableOpacity>
                       )}
                       keyExtractor={(item) => item.id.toString()}
                       style={styles.verseResultsList}
                       keyboardShouldPersistTaps="handled"
                     />
                   </View>
                 )}

                  {/* Input Area */}

              </View>
            </View>
          )}
          {moduleComponentVisibility && selectedVerse &&
          <>
          <View style={{ paddingTop: 50 }}>
            <VerseModule data={[selectedVerse]} active={4} url={''} />
          </View>
          </>
            
          }
        </View>
        <View style={{ height: "20%" }}>
          {!moduleComponentVisibility && (
            <>
            <View style={{flex: 1, justifyContent: 'flex-start'}}>
              <View style={styles.inputContainer}>
                    <View style={styles.inputRow}>
                      <View style={{width: '85%'}}>
                      <Input
                        placeholder="Search for verses..."
                        value={inputText}
                        onChangeText={handleInputChange}
                        placeholderTextColor={'white'}
                        inputStyle={{ color: 'white', fontSize: 22 }}
                        inputContainerStyle={{ borderBottomColor: 'white'}}
                        leftIcon={{ 
                          type: 'materialIcons', 
                          name: 'search',
                          color: '#ffffffff', 
                          size: 24 
                        }}
                        cursorColor={"#ffffff"}
                        selectionColor={'white'}
                        multiline={false}
                      />
                      </View>
                      <View style={{width: '15%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          onPress={handleSendMessage}
                          style={[
                            styles.sendIconButton,
                            !readyToSend && styles.sendIconButtonDisabled
                          ]}
                          activeOpacity={0.7}
                          disabled={!readyToSend}
                        >
                          <Ionicons 
                            name="send" 
                            size={28} 
                            color={readyToSend ? "#ac8861ff" : "rgba(172, 134, 97, 0.4)"} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
              </View>
            </View>
            </>
            )}
            <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 10}}>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>Promesas</Text>
            </View>
          </View>

      {/* </Animated.View> */}
    </ScreenComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  } as ViewStyle,
  messagesContainer: {
    // flex: 1,
    // paddingHorizontal: 10,
    paddingTop: 10,
  } as ViewStyle,
  messagesList: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 4,
    // paddingHorizontal: 10,
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
  quoteText: {
    color: 'white',
    fontSize: 22, // scales with screen height
    fontWeight: '300',
    textAlign: 'center',
    fontStyle: 'italic',
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
  verseResultsContainer: {
    // maxHeight: 150,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  } as ViewStyle,
  verseResultsList: {
    flexGrow: 0,
  },
  verseResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  verseResultText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  verseResultBody: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
  },
  inputContainer: {
    // paddingHorizontal: 10,
    paddingVertical: 8,
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(255, 255, 255, 0.2)',
  } as ViewStyle,
  inputRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    // gap: 10,
  } as ViewStyle,
  sendIconButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  sendIconButtonDisabled: {
    opacity: 0.5,
  } as ViewStyle,
});

export default ConversationScreen;

