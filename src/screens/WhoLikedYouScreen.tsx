import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

const { width } = Dimensions.get('window');

interface LikeProfile {
  id: string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  matchPercentage: number;
  timeAgo: string;
  isBlurred: boolean;
}

const sampleLikes: LikeProfile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 27,
    distance: '3 km away',
    occupation: 'Graphic Designer',
    matchPercentage: 89,
    timeAgo: '2 hours ago',
    isBlurred: false
  },
  {
    id: '2',
    name: 'Sophia',
    age: 25,
    distance: '7 km away',
    occupation: 'Teacher',
    matchPercentage: 92,
    timeAgo: '5 hours ago',
    isBlurred: false
  },
  {
    id: '3',
    name: '???',
    age: 26,
    distance: '4 km away',
    occupation: 'Marketing Specialist',
    matchPercentage: 85,
    timeAgo: '1 day ago',
    isBlurred: true
  },
  {
    id: '4',
    name: '???',
    age: 29,
    distance: '2 km away',
    occupation: 'Software Engineer',
    matchPercentage: 91,
    timeAgo: '2 days ago',
    isBlurred: true
  },
  {
    id: '5',
    name: '???',
    age: 24,
    distance: '6 km away',
    occupation: 'Photographer',
    matchPercentage: 88,
    timeAgo: '3 days ago',
    isBlurred: true
  }
];

interface WhoLikedYouScreenProps {
  navigation: any;
}

export default function WhoLikedYouScreen({ navigation }: WhoLikedYouScreenProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');

  const LikeCard = ({ profile }: { profile: LikeProfile }) => (
    <TouchableOpacity style={styles.likeCard}>
      <View style={styles.cardContent}>
        <View style={[styles.profileImage, profile.isBlurred && styles.blurredImage]}>
          {profile.isBlurred ? (
            <View style={styles.blurOverlay}>
              <Ionicons name="lock-closed" size={30} color={colors.text.white} />
            </View>
          ) : (
            <Ionicons name="person" size={40} color={colors.text.light} />
          )}
        </View>

        <View style={styles.matchBadge}>
          <Text style={styles.matchPercentage}>{profile.matchPercentage}%</Text>
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>
            {profile.isBlurred ? '???' : profile.name}, {profile.age}
          </Text>
          
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.distanceText}>{profile.distance}</Text>
          </View>
          
          <Text style={styles.occupation} numberOfLines={1}>
            {profile.isBlurred ? 'Upgrade to see' : profile.occupation}
          </Text>
          
          <Text style={styles.timeAgo}>{profile.timeAgo}</Text>
        </View>

        {!profile.isBlurred ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.passButton}>
              <Ionicons name="close" size={20} color={colors.error} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton}>
              <Ionicons name="heart" size={20} color={colors.success} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.premiumIndicator}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const recentLikes = sampleLikes.slice(0, 2);
  const allLikes = sampleLikes;
  const blurredCount = sampleLikes.filter(like => like.isBlurred).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Who Liked You</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="funnel-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {blurredCount > 0 && (
        <View style={styles.premiumBanner}>
          <View style={styles.premiumContent}>
            <View style={styles.premiumIcon}>
              <Ionicons name="star" size={24} color={colors.warning} />
            </View>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>
                {blurredCount} more {blurredCount === 1 ? 'person likes' : 'people like'} you!
              </Text>
              <Text style={styles.premiumSubtitle}>
                Upgrade to Premium to see who likes you
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Recent ({recentLikes.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({allLikes.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(activeTab === 'recent' ? recentLikes : allLikes).length > 0 ? (
          <View style={styles.likesContainer}>
            {(activeTab === 'recent' ? recentLikes : allLikes).map((profile) => (
              <LikeCard key={profile.id} profile={profile} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={60} color={colors.text.light} />
            <Text style={styles.emptyStateTitle}>No likes yet</Text>
            <Text style={styles.emptyStateText}>
              Keep swiping to find people who like you back!
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.discoverButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.discoverButtonText}>Discover More People</Text>
        </TouchableOpacity>
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
  premiumBanner: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.base,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  premiumSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  upgradeButton: {
    backgroundColor: colors.warning,
    height: buttonHeight.small,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
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
  content: {
    flex: 1,
  },
  likesContainer: {
    paddingHorizontal: spacing.xl,
  },
  likeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
    position: 'relative',
  },
  blurredImage: {
    backgroundColor: colors.text.secondary,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.base + 50,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 35,
    alignItems: 'center',
  },
  matchPercentage: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  profileDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  profileName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  distanceText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  occupation: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timeAgo: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  passButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  likeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.warning,
    marginLeft: spacing.xs,
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
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.base,
  },
  discoverButton: {
    backgroundColor: colors.accent,
    height: buttonHeight.medium,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discoverButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
});