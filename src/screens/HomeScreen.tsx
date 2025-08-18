import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Dimensions, Image, Alert, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { matchingService, DiscoveryProfile } from '../services';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [superLikedProfiles, setSuperLikedProfiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const currentProfile = profiles[currentProfileIndex];

  useEffect(() => {
    loadDiscoveryProfiles();
  }, []);

  const loadDiscoveryProfiles = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log('Loading discovery profiles...');
      const response = await matchingService.getDiscoveryProfiles();
      
      console.log('Discovery profiles response:', response);
      
      if (response.success && response.data) {
        setProfiles(response.data);
        setCurrentProfileIndex(0);
        console.log(`Loaded ${response.data.length} profiles for discovery`);
      } else {
        console.warn('No profiles available:', response.error);
        Alert.alert(
          'No Profiles Available',
          response.error || 'No new profiles to show at the moment. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Error loading discovery profiles:', error);
      Alert.alert(
        'Loading Error',
        'Unable to load profiles. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLike = async () => {
    if (!currentProfile || isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      console.log('Liking profile:', currentProfile.id);
      const response = await matchingService.likeProfile(currentProfile.id);
      
      console.log('Like response:', response);
      
      if (response.success && response.data) {
        setLikedProfiles(prev => [...prev, currentProfile.id]);
        
        if (response.data.isMatch) {
          Alert.alert(
            '🎉 It\'s a Match!', 
            `You and ${currentProfile.firstName} liked each other!`,
            [
              { text: 'Keep Swiping', onPress: () => nextProfile() },
              { text: 'Send Message', onPress: () => navigation.navigate('Chats') }
            ]
          );
        } else {
          Alert.alert('💕 Like Sent!', `You liked ${currentProfile.firstName}! We\'ll let you know if it\'s a match.`);
          nextProfile();
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to send like. Please try again.');
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      Alert.alert('Network Error', 'Unable to send like. Please check your connection.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePass = async () => {
    if (!currentProfile || isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      console.log('Passing on profile:', currentProfile.id);
      const response = await matchingService.passProfile(currentProfile.id);
      
      console.log('Pass response:', response);
      
      if (response.success) {
        nextProfile();
      } else {
        Alert.alert('Error', response.error || 'Failed to pass. Please try again.');
      }
    } catch (error) {
      console.error('Error passing profile:', error);
      Alert.alert('Network Error', 'Unable to pass. Please check your connection.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSuperLike = async () => {
    if (!currentProfile || isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      console.log('Super liking profile:', currentProfile.id);
      const response = await matchingService.superLikeProfile(currentProfile.id);
      
      console.log('Super like response:', response);
      
      if (response.success && response.data) {
        setSuperLikedProfiles(prev => [...prev, currentProfile.id]);
        
        if (response.data.isMatch) {
          Alert.alert(
            '🌟 Super Match!', 
            `You and ${currentProfile.firstName} super liked each other!`,
            [
              { text: 'Keep Swiping', onPress: () => nextProfile() },
              { text: 'Send Message', onPress: () => navigation.navigate('Chats') }
            ]
          );
        } else {
          Alert.alert(
            '⭐ Super Like Sent!', 
            `You super liked ${currentProfile.firstName}! They'll see this first.`
          );
          nextProfile();
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to send super like. Please try again.');
      }
    } catch (error) {
      console.error('Error super liking profile:', error);
      Alert.alert('Network Error', 'Unable to send super like. Please check your connection.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Load more profiles or show end message
      loadDiscoveryProfiles();
    }
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen coming soon!');
  };

  const handleMessages = () => {
    navigation.navigate('Chats');
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
        <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={28} color={colors.primary} />
          <Text style={styles.logoText}>Connect</Text>
        </View>
        
        <TouchableOpacity style={styles.headerButton} onPress={handleMessages}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.text.primary} />
          <View style={styles.messageBadge}>
            <Text style={styles.messageBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadDiscoveryProfiles(true)}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Finding amazing people for you...</Text>
          </View>
        ) : !currentProfile ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color={colors.text.light} />
            <Text style={styles.emptyTitle}>No More Profiles</Text>
            <Text style={styles.emptyText}>
              You've seen all available profiles. Check back later for new people!
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={() => loadDiscoveryProfiles(true)}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cardContainer}>
              <View style={styles.profileCard}>
                <View style={styles.profileImageContainer}>
                  <View style={styles.profileImage}>
                    {currentProfile.photos && currentProfile.photos.length > 0 ? (
                      <Image 
                        source={{ uri: currentProfile.photos[0].url }}
                        style={styles.profileImagePhoto}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="person" size={80} color={colors.text.light} />
                    )}
                  </View>
                  
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchPercentage}>{currentProfile.matchPercentage}%</Text>
                    <Text style={styles.matchText}>Match</Text>
                  </View>
                </View>

            <View style={styles.profileInfo}>
              <View style={styles.profileHeader}>
                <Text style={styles.profileName}>
                  {currentProfile.firstName} {currentProfile.lastName}, {calculateAge(currentProfile.dateOfBirth)}
                </Text>
                <View style={styles.distanceContainer}>
                  <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.distanceText}>
                    {currentProfile.distance ? `${Math.round(currentProfile.distance)} km away` : 'Location nearby'}
                  </Text>
                </View>
              </View>

              <Text style={styles.occupation}>{currentProfile.occupation || 'Professional'}</Text>

              <View style={styles.interestsContainer}>
                <Text style={styles.interestsLabel}>Interests</Text>
                <View style={styles.interestsTags}>
                  {currentProfile.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {currentProfile.commonInterests && currentProfile.commonInterests.length > 0 && (
                <View style={styles.compatibilitySection}>
                  <Text style={styles.compatibilityLabel}>Compatibility Highlights</Text>
                  {currentProfile.commonInterests.map((interest, index) => (
                    <View key={index} style={styles.compatibilityItem}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                      <Text style={styles.compatibilityText}>Shared interest in {interest}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.passButton, { opacity: isActionLoading ? 0.6 : 1 }]} 
                onPress={handlePass}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <Ionicons name="close" size={30} color={colors.error} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.superLikeButton, { opacity: isActionLoading ? 0.6 : 1 }]} 
                onPress={handleSuperLike}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <Ionicons name="star" size={24} color={colors.accent} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.likeButton, { opacity: isActionLoading ? 0.6 : 1 }]} 
                onPress={handleLike}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <ActivityIndicator size="small" color={colors.success} />
                ) : (
                  <Ionicons name="heart" size={30} color={colors.success} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert('Boost', 'Your profile will be shown to more people!')}>
                <Ionicons name="flash" size={20} color={colors.warning} />
                <Text style={styles.quickActionText}>Boost</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert('Rewind', 'Go back to the previous profile')}>
                <Ionicons name="repeat" size={20} color={colors.accent} />
                <Text style={styles.quickActionText}>Rewind</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('WhoLikedYou')}>
                <Ionicons name="eye" size={20} color={colors.secondary} />
                <Text style={styles.quickActionText}>Who Liked You</Text>
                <View style={styles.likeBadge}>
                  <Text style={styles.likeBadgeText}>5</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  content: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  matchBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    alignItems: 'center',
  },
  matchPercentage: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  matchText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.white,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileName: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  occupation: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  interestsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  interestsLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  interestTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  interestText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.white,
  },
  compatibilitySection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  compatibilityLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  compatibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  compatibilityText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.xl,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  superLikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  quickActionText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  messageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  likeBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing['5xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.base,
    marginBottom: spacing.xl,
  },
  refreshButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  refreshButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  profileImagePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
});