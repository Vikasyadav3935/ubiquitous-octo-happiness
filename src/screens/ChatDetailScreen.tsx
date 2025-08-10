import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, inputHeight } from '../constants/spacing';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  isRead?: boolean;
  messageType: 'text' | 'image' | 'audio' | 'location';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatDetailScreenProps {
  navigation: any;
  route: any;
}

export default function ChatDetailScreen({ navigation, route }: ChatDetailScreenProps) {
  const { chat } = route.params;
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey there! How are you doing today?',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '2',
      text: 'Hi! I\'m doing great, thanks for asking! Just got back from a morning hike. How about you?',
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '3',
      text: 'That sounds amazing! I love hiking too. Which trail did you go to?',
      timestamp: new Date(Date.now() - 3400000),
      isOwn: false,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '4',
      text: 'I went to the Blue Ridge Trail. The view at the top was absolutely breathtaking! Do you have any favorite trails?',
      timestamp: new Date(Date.now() - 3300000),
      isOwn: true,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '5',
      text: 'Oh I know that one! I love the waterfall section. We should definitely plan a hike together sometime 😊',
      timestamp: new Date(Date.now() - 3200000),
      isOwn: false,
      messageType: 'text',
      status: 'read'
    }
  ]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      timestamp: new Date(),
      isOwn: true,
      messageType: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);

    // Auto scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'More Options',
      'Choose an action',
      [
        { text: 'View Profile', onPress: () => navigation.navigate('UserProfile', { user: chat }) },
        { text: 'Chat Settings', onPress: () => navigation.navigate('ChatSettings', { chat }) },
        { text: 'Block User', onPress: () => navigation.navigate('BlockReportUser', { user: chat, action: 'block' }), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const MessageBubble = ({ message: msg }: { message: Message }) => (
    <View style={[styles.messageContainer, msg.isOwn && styles.ownMessageContainer]}>
      <View style={[styles.messageBubble, msg.isOwn ? styles.ownMessageBubble : styles.otherMessageBubble]}>
        <Text style={[styles.messageText, msg.isOwn && styles.ownMessageText]}>
          {msg.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, msg.isOwn && styles.ownMessageTime]}>
            {formatTime(msg.timestamp)}
          </Text>
          {msg.isOwn && (
            <View style={styles.messageStatus}>
              {msg.status === 'sending' && (
                <Ionicons name="time-outline" size={12} color={colors.text.light} />
              )}
              {msg.status === 'sent' && (
                <Ionicons name="checkmark" size={12} color={colors.text.light} />
              )}
              {msg.status === 'delivered' && (
                <Ionicons name="checkmark-done" size={12} color={colors.text.light} />
              )}
              {msg.status === 'read' && (
                <Ionicons name="checkmark-done" size={12} color={colors.primary} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    
    messages.forEach(msg => {
      const dateKey = formatDate(msg.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  // Simulate typing indicator
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (message.length > 0) {
      setIsTyping(true);
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }

    return () => clearTimeout(typingTimeout);
  }, [message]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => navigation.navigate('UserProfile', { user: chat })}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{chat.name}</Text>
              <Text style={styles.userStatus}>
                {chat.isOnline ? 'Online now' : 'Last seen recently'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => navigation.navigate('VideoCall', { user: chat })}
          >
            <Ionicons name="videocam" size={22} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => Alert.alert('Voice Call', 'Starting voice call...')}
          >
            <Ionicons name="call" size={22} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={handleMoreOptions}
          >
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <View key={date}>
              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>{date}</Text>
              </View>
              {dateMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </View>
          ))}
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.messageInputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.text.light}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy-outline" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: message.trim().length > 0 ? 1 : 0.5 }]}
            onPress={sendMessage}
            disabled={message.trim().length === 0}
          >
            <Ionicons name="send" size={20} color={colors.text.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  profileSection: {
    flex: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
  userStatus: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dateSeparatorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.light,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  messageContainer: {
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  otherMessageBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  ownMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.base,
  },
  ownMessageText: {
    color: colors.text.white,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messageStatus: {
    marginLeft: spacing.xs,
  },
  typingIndicator: {
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  typingBubble: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.light,
  },
  typingDot1: {
    // Animation would be added here
  },
  typingDot2: {
    // Animation would be added here
  },
  typingDot3: {
    // Animation would be added here
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    minHeight: inputHeight.small,
    maxHeight: 100,
  },
  attachButton: {
    padding: spacing.sm,
  },
  messageInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    textAlignVertical: 'center',
  },
  emojiButton: {
    padding: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});