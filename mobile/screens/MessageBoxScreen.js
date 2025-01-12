import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllMessages, sendMessageToDoctor } from '../services/Message';

const MessageBoxScreen = ({ route }) => {
  const { user, doctor } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user?.id || !doctor?.id) {
          setError('Missing user or doctor information.');
          setMessages([]);
          setLoading(false);
          return;
        }

        const fetchedMessages = await getAllMessages(user.id, doctor.id);
        console.log('Fetched Messages:', fetchedMessages);

        if (fetchedMessages?.message && Array.isArray(fetchedMessages.message)) {
          const formattedMessages = fetchedMessages.message
            .map((msg, index) => ({
              id: index.toString(),
              text: msg.message,
              sender: msg.sender_id === user.id ? 'user' : 'doctor',
              senderName: msg.sender_name,
              date: new Date(msg.date), // Convert to Date object for sorting
            }))
            .sort((a, b) => a.date - b.date); // Sort messages in ascending order

          setMessages(formattedMessages);
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

    fetchMessages();
  }, [user, doctor]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender_id: user.id,
        receiver_id: doctor.id,
        message: message, 
        date: new Date(),
      };
      
      try {
        setLoading(true);

        const response = await sendMessageToDoctor(newMessage);
        console.log("response", response);
        if (response?.status === 200) {
          const sentMessage = {
            ...newMessage,
            id: (messages.length + 1).toString(),
            sender: 'user',
            senderName: user.name,
            date: new Date(),
          };

          setMessages((prevMessages) =>
            [...prevMessages, sentMessage].sort((a, b) => a.date - b.date)
          );
        } else {
          setError('Failed to send message');
        }
      } catch (err) {
        console.error('Error sending message:', err.message);
        setError('Unable to send the message. Please try again later.');
      } finally {
        setMessage('');
        setLoading(false);
      }
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
      <Text style={styles.senderName}>{item.senderName}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text>Loading messages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <LinearGradient
            colors={['#1E3A5F', '#FFFFFF']}
            style={styles.gradientBackground}
          >
            <Text style={styles.headerText}>Message with Dr. {doctor?.name}</Text>

            <View style={styles.messagesContainer}>
              <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
              />
              <Button title="Send" onPress={handleSendMessage} />
            </View>
          </LinearGradient>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
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
    justifyContent: 'flex-start', // Adjust to align to top
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
  senderName: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MessageBoxScreen;
