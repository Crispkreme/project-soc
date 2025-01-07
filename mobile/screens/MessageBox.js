import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    FlatList,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    ScrollView,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MessageBoxScreen = ({ route }) => {
  const { doctor } = route.params; // Access the doctor data passed from ChatScreen

  const [messages, setMessages] = useState([
    // Initial mock conversation
    { id: '1', text: 'Hello, Doctor!', sender: 'user' },
    { id: '2', text: 'Hello! How can I assist you today?', sender: 'doctor' },
  ]);
  const [message, setMessage] = useState(''); // State to store the typed message

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add the user's message to the conversation
      const newMessages = [
        ...messages,
        { id: (messages.length + 1).toString(), text: message, sender: 'user' },
      ];

      // Simulate doctor’s response after the user message
      newMessages.push({
        id: (messages.length + 2).toString(),
        text: "I'm here to help! What else can I do for you?",
        sender: 'doctor',
      });

      // Update the messages state
      setMessages(newMessages);
      setMessage(''); // Clear the message input field
    }
  };

  // Render each message in the conversation
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjusted for better alignment on iOS
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <LinearGradient
            colors={['#1E3A5F', '#FFFFFF']} // Navy blue to white gradient
            style={styles.gradientBackground}
          >
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <Text style={styles.headerText}>Message with Dr. {doctor.name}</Text>
              
              {/* Chat messages */}
              <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                inverted={true} // Show the newest messages at the bottom
                contentContainerStyle={styles.messagesList}
              />

              {/* Input and send button */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  value={message}
                  onChangeText={setMessage}
                />
                <Button title="Send" onPress={handleSendMessage} />
              </View>
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window'); // Get the screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1, 
    paddingBottom: 20, // Add padding to the bottom to avoid cutting off content
  },
  gradientBackground: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1, // Makes the content scrollable when the keyboard is open
    justifyContent: 'flex-end', // Aligns the content towards the bottom to give space for input
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // White color for the text to contrast with the background
  },
  messagesList: {
    paddingBottom: 10,
  },
  message: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: width - 60, // Make sure messages don’t exceed screen width (with padding)
    marginHorizontal: 20, // Center messages within the screen
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
    marginBottom: 10,
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: width - 40,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    marginRight: 10,
  },
});

export default MessageBoxScreen;
