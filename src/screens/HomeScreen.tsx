import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

const { width } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: string;
  occupation: string;
  interests: string[];
  matchPercentage: number;
}

const sampleProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    distance: '2 km away',
    occupation: 'Product Designer',
    interests: ['Photography', 'Travel', 'Yoga'],
    matchPercentage: 95
  },
  {
    id: '2',
    name: 'Emily',
    age: 26,
    distance: '5 km away',
    occupation: 'Marketing Manager',
    interests: ['Music', 'Cooking', 'Hiking'],
    matchPercentage: 87
  },
  {
    id: '3',
    name: 'Jessica',
    age: 24,
    distance: '3 km away',
    occupation: 'Software Engineer',
    interests: ['Gaming', 'Books', 'Art'],
    matchPercentage: 92
  }
];

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const currentProfile = sampleProfiles[currentProfileIndex];

  const handleLike = () => {
    if (currentProfileIndex < sampleProfiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handlePass = () => {
    if (currentProfileIndex < sampleProfiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handleSuperLike = () => {
    if (currentProfileIndex < sampleProfiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={28} color={colors.primary} />
          <Text style={styles.logoText}>Match</Text>
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={80} color={colors.text.light} />
              </View>
              
              <View style={styles.matchBadge}>
                <Text style={styles.matchPercentage}>{currentProfile.matchPercentage}%</Text>
                <Text style={styles.matchText}>Match</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.profileHeader}>
                <Text style={styles.profileName}>
                  {currentProfile.name}, {currentProfile.age}
                </Text>
                <View style={styles.distanceContainer}>
                  <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.distanceText}>{currentProfile.distance}</Text>
                </View>
              </View>

              <Text style={styles.occupation}>{currentProfile.occupation}</Text>

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

              <View style={styles.compatibilitySection}>
                <Text style={styles.compatibilityLabel}>Compatibility Highlights</Text>
                <View style={styles.compatibilityItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.compatibilityText}>Similar life goals</Text>
                </View>
                <View style={styles.compatibilityItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.compatibilityText}>Shared interests in travel</Text>
                </View>
                <View style={styles.compatibilityItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.compatibilityText}>Compatible communication style</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.passButton} onPress={handlePass}>
            <Ionicons name="close" size={30} color={colors.error} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.superLikeButton} onPress={handleSuperLike}>
            <Ionicons name="star" size={24} color={colors.accent} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Ionicons name="heart" size={30} color={colors.success} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="flash" size={20} color={colors.warning} />
            <Text style={styles.quickActionText}>Boost</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="repeat" size={20} color={colors.accent} />
            <Text style={styles.quickActionText}>Rewind</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="eye" size={20} color={colors.secondary} />
            <Text style={styles.quickActionText}>Visitors</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});