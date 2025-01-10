import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { getAllMessages } from '../services/Message';

const MessageBoxScreen = ({ route }) => {
  
  const { user } = route.params;
  const { doctor } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = {
          receiverId: doctor?.id,
          senderId: user?.id,
        };
        
        const fetchedMessages = await getAllMessages(data);
        console.log("fetchedMessages", fetchedMessages);
        if (fetchedMessages && Array.isArray(fetchedMessages)) {
          setMessages(fetchedMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Error fetching messages:', err.message);
        setError('Unable to fetch messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (doctor && user) {
      fetchMessages();
    }
  }, [doctor, user]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessages = [
        ...messages,
        { id: (messages.length + 1).toString(), text: message, sender: 'user' },
      ];

      newMessages.push({
        id: (messages.length + 2).toString(),
        text: "I'm here to help! What else can I do for you?",
        sender: 'doctor',
      });

      setMessages(newMessages);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === 'user' ? styles.userMessage : styles.doctorMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading messages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>{error}</Text>
      </View>
    );
  }

  // return (
  //   <KeyboardAvoidingView
  //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  //     style={styles.container}
  //     keyboardVerticalOffset={90}
  //   >
  //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  //       <SafeAreaView style={[styles.safeArea, { flexGrow: 1 }]}>
  //         <LinearGradient
  //           colors={['#1E3A5F', '#FFFFFF']}
  //           style={styles.gradientBackground}
  //         >
  //           <Text style={styles.headerText}>Message with Dr. {doctor.name}</Text>

  //           <View style={styles.messagesContainer}>
  //             <FlatList
  //               data={messages}
  //               renderItem={renderMessage}
  //               keyExtractor={(item) => item.id}
  //               contentContainerStyle={styles.messagesList}
  //               inverted
  //             />
  //           </View>

  //           <View style={styles.inputContainer}>
  //             <TextInput
  //               style={styles.input}
  //               placeholder="Type a message..."
  //               value={message}
  //               onChangeText={setMessage}
  //             />
  //             <Button title="Send" onPress={handleSendMessage} />
  //           </View>
  //         </LinearGradient>
  //       </SafeAreaView>
  //     </TouchableWithoutFeedback>
  //   </KeyboardAvoidingView>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#d1e7ff',
    alignSelf: 'flex-end',
  },
  doctorMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
});

export default MessageBoxScreen;
