import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, inputHeight } from '../constants/spacing';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const sampleChats: Chat[] = [
  {
    id: '1',
    name: 'Sarah Miller',
    lastMessage: 'That sounds amazing! Would love to join you for hiking this weekend.',
    timestamp: '2m ago',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Emily Johnson',
    lastMessage: 'Thanks for the book recommendation! Just started reading it.',
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: '3',
    name: 'Jessica Davis',
    lastMessage: 'Great meeting you today! Looking forward to our coffee date.',
    timestamp: '3h ago',
    unreadCount: 1,
    isOnline: false
  },
  {
    id: '4',
    name: 'Amanda Wilson',
    lastMessage: 'The concert was incredible! Thank you for such a wonderful evening.',
    timestamp: '1d ago',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '5',
    name: 'Lisa Brown',
    lastMessage: 'I completely agree with your thoughts on that movie.',
    timestamp: '2d ago',
    unreadCount: 0,
    isOnline: true
  }
];

interface ChatsScreenProps {
  navigation: any;
}

export default function ChatsScreen({ navigation }: ChatsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'messages'>('all');

  const filteredChats = sampleChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatItem = ({ chat }: { chat: Chat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('ChatDetail', { chat })}>
      <View style={styles.chatInfo}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
          </View>
          {chat.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{chat.name}</Text>
            <Text style={styles.timestamp}>{chat.timestamp}</Text>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text.light} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
          onPress={() => setActiveTab('matches')}
        >
          <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
            New Matches
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'matches' && (
        <View style={styles.newMatchesContainer}>
          <Text style={styles.sectionTitle}>New Matches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchesScroll}>
            {[1, 2, 3, 4, 5].map((match) => (
              <TouchableOpacity key={match} style={styles.matchItem}>
                <View style={styles.matchAvatar}>
                  <Ionicons name="person" size={24} color={colors.text.light} />
                </View>
                <Text style={styles.matchName}>Match {match}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
        <View style={styles.chatsContainer}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={60} color={colors.text.light} />
              <Text style={styles.emptyStateTitle}>No conversations found</Text>
              <Text style={styles.emptyStateText}>
                Start matching with people to begin conversations
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.newChatButton}>
        <Ionicons name="add" size={24} color={colors.text.white} />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    height: inputHeight.small,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.white,
  },
  newMatchesContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  matchesScroll: {
    flexGrow: 0,
  },
  matchItem: {
    alignItems: 'center',
    marginRight: spacing.base,
    width: 80,
  },
  matchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  matchName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  chatsList: {
    flex: 1,
  },
  chatsContainer: {
    paddingHorizontal: spacing.xl,
  },
  chatItem: {
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.base,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['5xl'],
  },
  emptyStateTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  newChatButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});