import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

const { width, height } = Dimensions.get('window');

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  uri: string;
  name?: string;
  size?: string;
  date: Date;
  sender: 'me' | 'other';
}

interface MediaViewerScreenProps {
  navigation: any;
  route: any;
}

export default function MediaViewerScreen({ navigation, route }: MediaViewerScreenProps) {
  const { chat } = route.params;
  const [activeTab, setActiveTab] = useState<'media' | 'documents' | 'links'>('media');

  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      uri: '',
      date: new Date(Date.now() - 86400000),
      sender: 'other'
    },
    {
      id: '2',
      type: 'image',
      uri: '',
      date: new Date(Date.now() - 172800000),
      sender: 'me'
    },
    {
      id: '3',
      type: 'video',
      uri: '',
      date: new Date(Date.now() - 259200000),
      sender: 'other'
    },
    {
      id: '4',
      type: 'image',
      uri: '',
      date: new Date(Date.now() - 345600000),
      sender: 'me'
    },
    {
      id: '5',
      type: 'document',
      uri: '',
      name: 'restaurant_menu.pdf',
      size: '2.4 MB',
      date: new Date(Date.now() - 432000000),
      sender: 'other'
    },
    {
      id: '6',
      type: 'image',
      uri: '',
      date: new Date(Date.now() - 518400000),
      sender: 'me'
    }
  ]);

  const [linkItems] = useState([
    {
      id: '1',
      url: 'https://example.com/hiking-trail',
      title: 'Best Hiking Trails in Blue Ridge',
      description: 'Discover the most scenic hiking trails with waterfalls and mountain views.',
      date: new Date(Date.now() - 86400000),
      sender: 'other'
    },
    {
      id: '2',
      url: 'https://example.com/restaurant',
      title: 'Italian Restaurant Downtown',
      description: 'Authentic Italian cuisine with great reviews and cozy atmosphere.',
      date: new Date(Date.now() - 172800000),
      sender: 'me'
    }
  ]);

  const mediaFilteredItems = mediaItems.filter(item => item.type === 'image' || item.type === 'video');
  const documentItems = mediaItems.filter(item => item.type === 'document');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleMediaPress = (mediaId: string) => {
    Alert.alert('Media Viewer', 'Full screen media viewer would open here');
  };

  const handleDownload = (item: MediaItem) => {
    Alert.alert('Download', `${item.name || 'Media'} downloaded successfully`);
  };

  const handleShare = (item: MediaItem) => {
    Alert.alert('Share', `Sharing ${item.name || 'media'}...`);
  };

  const MediaGrid = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.gridContainer}>
        {mediaFilteredItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.mediaItem}
            onPress={() => handleMediaPress(item.id)}
          >
            <View style={styles.mediaPlaceholder}>
              {item.type === 'video' ? (
                <View style={styles.videoOverlay}>
                  <Ionicons name="play" size={24} color={colors.text.white} />
                </View>
              ) : (
                <Ionicons name="image" size={30} color={colors.text.light} />
              )}
            </View>
            <View style={styles.mediaInfo}>
              <Text style={styles.mediaDate}>{formatDate(item.date)}</Text>
              <View style={styles.senderIndicator}>
                <View style={[
                  styles.senderDot,
                  { backgroundColor: item.sender === 'me' ? colors.primary : colors.accent }
                ]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {mediaFilteredItems.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={60} color={colors.text.light} />
          <Text style={styles.emptyStateTitle}>No media shared yet</Text>
          <Text style={styles.emptyStateText}>
            Photos and videos you share will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const DocumentsList = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.documentsContainer}>
        {documentItems.map((item) => (
          <View key={item.id} style={styles.documentItem}>
            <View style={styles.documentLeft}>
              <View style={styles.documentIcon}>
                <Ionicons name="document-text" size={24} color={colors.accent} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{item.name}</Text>
                <Text style={styles.documentMeta}>
                  {item.size} • {formatDate(item.date)}
                </Text>
              </View>
            </View>
            
            <View style={styles.documentActions}>
              <TouchableOpacity 
                style={styles.documentActionButton}
                onPress={() => handleDownload(item)}
              >
                <Ionicons name="download-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.documentActionButton}
                onPress={() => handleShare(item)}
              >
                <Ionicons name="share-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      
      {documentItems.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={60} color={colors.text.light} />
          <Text style={styles.emptyStateTitle}>No documents shared</Text>
          <Text style={styles.emptyStateText}>
            Files and documents you share will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const LinksList = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.linksContainer}>
        {linkItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.linkItem}>
            <View style={styles.linkIcon}>
              <Ionicons name="link" size={20} color={colors.secondary} />
            </View>
            
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.linkDescription} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.linkUrl} numberOfLines={1}>{item.url}</Text>
              <Text style={styles.linkDate}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.linkAction}>
              <Ionicons name="open-outline" size={20} color={colors.text.secondary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {linkItems.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="link-outline" size={60} color={colors.text.light} />
          <Text style={styles.emptyStateTitle}>No links shared</Text>
          <Text style={styles.emptyStateText}>
            Links you share will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const TabButton = ({ tab, label, count }: { tab: string; label: string; count: number }) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab as any)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

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
        
        <Text style={styles.headerTitle}>Shared Media</Text>
        
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={22} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{chat.name?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{chat.name || 'User'}</Text>
          <Text style={styles.mediaCount}>
            {mediaFilteredItems.length + documentItems.length + linkItems.length} items shared
          </Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TabButton tab="media" label="Media" count={mediaFilteredItems.length} />
        <TabButton tab="documents" label="Files" count={documentItems.length} />
        <TabButton tab="links" label="Links" count={linkItems.length} />
      </View>

      <View style={styles.content}>
        {activeTab === 'media' && <MediaGrid />}
        {activeTab === 'documents' && <DocumentsList />}
        {activeTab === 'links' && <LinksList />}
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  mediaCount: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.base,
    gap: spacing.xs,
  },
  mediaItem: {
    width: (width - spacing.base * 2 - spacing.xs * 2) / 3,
    aspectRatio: 1,
    marginBottom: spacing.xs,
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  mediaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  mediaDate: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
  },
  senderIndicator: {
    alignItems: 'center',
  },
  senderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  documentsContainer: {
    padding: spacing.base,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  documentMeta: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  documentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  documentActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksContainer: {
    padding: spacing.base,
  },
  linkItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: 12,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  linkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
    marginTop: spacing.xs,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  linkDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  linkUrl: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  linkDate: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
  },
  linkAction: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['5xl'],
    paddingHorizontal: spacing.xl,
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
  },
});