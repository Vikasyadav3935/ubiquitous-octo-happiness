import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface PremiumFeaturesScreenProps {
  navigation: any;
}

interface PremiumPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  popular?: boolean;
}

const premiumPlans: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    duration: '1 Month',
    price: '$9.99',
    originalPrice: '$12.99',
    savings: 'Save 23%'
  },
  {
    id: 'quarterly',
    name: 'Premium Quarterly',
    duration: '3 Months',
    price: '$19.99',
    originalPrice: '$29.97',
    savings: 'Save 33%',
    popular: true
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    duration: '12 Months',
    price: '$59.99',
    originalPrice: '$119.88',
    savings: 'Save 50%'
  }
];

const premiumFeatures = [
  {
    icon: 'eye',
    title: 'See Who Likes You',
    description: 'View all your likes without the guesswork',
    category: 'discovery'
  },
  {
    icon: 'infinite',
    title: 'Unlimited Likes',
    description: 'Like as many profiles as you want',
    category: 'discovery'
  },
  {
    icon: 'flash',
    title: '5 Super Likes Daily',
    description: 'Stand out with Super Likes every day',
    category: 'discovery'
  },
  {
    icon: 'rocket',
    title: 'Monthly Boost',
    description: 'Be the top profile in your area for 30 minutes',
    category: 'discovery'
  },
  {
    icon: 'location',
    title: 'Change Location',
    description: 'Match with people in different cities',
    category: 'advanced'
  },
  {
    icon: 'repeat',
    title: 'Unlimited Rewinds',
    description: 'Undo your last swipe anytime',
    category: 'advanced'
  },
  {
    icon: 'chatbubbles',
    title: 'Message Before Matching',
    description: 'Send messages to profiles you like',
    category: 'messaging'
  },
  {
    icon: 'checkmark-done',
    title: 'Read Receipts',
    description: 'See when your messages are read',
    category: 'messaging'
  },
  {
    icon: 'shield-checkmark',
    title: 'Priority Support',
    description: 'Get faster help from our support team',
    category: 'support'
  },
  {
    icon: 'analytics',
    title: 'Advanced Filters',
    description: 'Filter by education, lifestyle, and more',
    category: 'advanced'
  }
];

export default function PremiumFeaturesScreen({ navigation }: PremiumFeaturesScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [activeFeatureCategory, setActiveFeatureCategory] = useState('all');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    const plan = premiumPlans.find(p => p.id === selectedPlan);
    Alert.alert(
      'Confirm Subscription',
      `Subscribe to ${plan?.name} for ${plan?.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => Alert.alert('Success', 'Subscription activated!') }
      ]
    );
  };

  const categories = ['all', 'discovery', 'messaging', 'advanced', 'support'];

  const filteredFeatures = activeFeatureCategory === 'all' 
    ? premiumFeatures 
    : premiumFeatures.filter(feature => feature.category === activeFeatureCategory);

  const PlanCard = ({ plan }: { plan: PremiumPlan }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.selectedPlan,
        plan.popular && styles.popularPlan
      ]}
      onPress={() => handlePlanSelect(plan.id)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <View>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDuration}>{plan.duration}</Text>
        </View>
        
        <View style={styles.planPricing}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          {plan.originalPrice && (
            <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
          )}
        </View>
      </View>
      
      {plan.savings && (
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>{plan.savings}</Text>
        </View>
      )}
      
      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        </View>
      )}
    </TouchableOpacity>
  );

  const FeatureItem = ({ feature }: { feature: typeof premiumFeatures[0] }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={feature.icon as any} size={24} color={colors.warning} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  const CategoryTab = ({ category, isActive, onPress }: { category: string; isActive: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
      onPress={onPress}
    >
      <Text style={[styles.categoryTabText, isActive && styles.activeCategoryTabText]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Premium Features</Text>
        
        <TouchableOpacity style={styles.restoreButton}>
          <Text style={styles.restoreButtonText}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="star" size={40} color={colors.warning} />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium</Text>
          <Text style={styles.heroSubtitle}>
            Get more matches, see who likes you, and access exclusive features
          </Text>
        </View>

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {premiumPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryTab
                key={category}
                category={category}
                isActive={activeFeatureCategory === category}
                onPress={() => setActiveFeatureCategory(category)}
              />
            ))}
          </ScrollView>

          <View style={styles.featuresGrid}>
            {filteredFeatures.map((feature, index) => (
              <FeatureItem key={index} feature={feature} />
            ))}
          </View>
        </View>

        <View style={styles.testimonialSection}>
          <View style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitial}>S</Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>Sarah M.</Text>
                <View style={styles.starsContainer}>
                  {[1,2,3,4,5].map(star => (
                    <Ionicons key={star} name="star" size={14} color={colors.warning} />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              "Premium helped me find my perfect match! Being able to see who liked me saved so much time."
            </Text>
          </View>
        </View>

        <View style={styles.guaranteeSection}>
          <View style={styles.guaranteeIcon}>
            <Ionicons name="shield-checkmark" size={24} color={colors.success} />
          </View>
          <Text style={styles.guaranteeTitle}>30-Day Money Back Guarantee</Text>
          <Text style={styles.guaranteeText}>
            Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.
          </Text>
        </View>

        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>
            Start Premium - {premiumPlans.find(p => p.id === selectedPlan)?.price}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>Cancel Anytime</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
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
  restoreButton: {
    paddingVertical: spacing.sm,
  },
  restoreButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  plansSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: colors.primary,
  },
  popularPlan: {
    borderColor: colors.warning,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: spacing.lg,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  planDuration: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
  savingsContainer: {
    marginTop: spacing.md,
  },
  savingsText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.success,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
  },
  featuresSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  categoriesContainer: {
    marginBottom: spacing.lg,
    flexGrow: 0,
  },
  categoryTab: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCategoryTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryTabText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  activeCategoryTabText: {
    color: colors.text.white,
  },
  featuresGrid: {
    gap: spacing.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  testimonialSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  testimonialCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  testimonialInitial: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  testimonialName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  guaranteeSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  guaranteeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  guaranteeTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  guaranteeText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xl,
    height: buttonHeight.large,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  footerLinkText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
  },
  footerSeparator: {
    fontSize: typography.fontSize.xs,
    color: colors.text.light,
    marginHorizontal: spacing.sm,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});