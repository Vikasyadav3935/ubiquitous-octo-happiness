import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: '1',
    category: 'Personality',
    question: 'How would you describe your social energy?',
    options: ['Very Introverted', 'Somewhat Introverted', 'Balanced', 'Somewhat Extroverted', 'Very Extroverted']
  },
  {
    id: '2',
    category: 'Beliefs',
    question: 'What role does spirituality play in your life?',
    options: ['Very Important', 'Somewhat Important', 'Neutral', 'Not Important', 'Prefer Not to Say']
  },
  {
    id: '3',
    category: 'Lifestyle',
    question: 'How do you prefer to spend your free time?',
    options: ['Outdoor Adventures', 'Reading & Learning', 'Social Gatherings', 'Creative Pursuits', 'Relaxing at Home']
  },
  {
    id: '4',
    category: 'Values',
    question: 'What matters most to you in a relationship?',
    options: ['Trust & Honesty', 'Shared Goals', 'Emotional Connection', 'Physical Attraction', 'Common Interests']
  },
  {
    id: '5',
    category: 'Goals',
    question: 'Where do you see yourself in 5 years?',
    options: ['Career Focused', 'Family Oriented', 'Travel & Exploration', 'Personal Growth', 'Financial Security']
  },
  {
    id: '6',
    category: 'Communication',
    question: 'How do you handle conflicts?',
    options: ['Direct Discussion', 'Give Space First', 'Seek Compromise', 'Avoid Confrontation', 'Seek Help from Others']
  }
];

interface QuestionsScreenProps {
  navigation: any;
  route?: any;
}

export default function QuestionsScreen({ navigation, route }: QuestionsScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  
  // Check if this is an edit mode (coming from Profile screen)
  const isEditMode = route?.params?.isEditMode || false;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      Alert.alert('Please Select an Answer', 'Choose an option before proceeding');
      return;
    }

    if (isLastQuestion) {
      if (isEditMode) {
        // If editing, navigate back to Profile screen
        Alert.alert(
          'Questions Updated',
          'Your personality questions have been updated successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Use replace to prevent going back to questions after initial completion
        navigation.replace('MainApp');
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
        <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={currentQuestionIndex === 0 ? () => navigation.goBack() : handlePrevious}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: answers[currentQuestion.id] === option ? colors.primary : colors.surface,
                    borderColor: answers[currentQuestion.id] === option ? colors.primary : colors.border
                  }
                ]}
                onPress={() => handleAnswerSelect(option)}
              >
                <Text style={[
                  styles.optionText,
                  { color: answers[currentQuestion.id] === option ? colors.text.white : colors.text.primary }
                ]}>
                  {option}
                </Text>
                {answers[currentQuestion.id] === option && (
                  <Ionicons name="checkmark" size={20} color={colors.text.white} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.nextButton,
              { opacity: answers[currentQuestion.id] ? 1 : 0.6 }
            ]}
            onPress={handleNext}
            disabled={!answers[currentQuestion.id]}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? (isEditMode ? 'Update Questions' : 'Complete Setup') : 'Next'}
            </Text>
            {!isLastQuestion && (
              <Ionicons name="arrow-forward" size={20} color={colors.text.white} style={styles.nextIcon} />
            )}
          </TouchableOpacity>

          {!isLastQuestion && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => isEditMode ? navigation.goBack() : navigation.replace('MainApp')}
            >
              <Text style={styles.skipButtonText}>
                {isEditMode ? 'Cancel' : 'Skip Questions'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  progressContainer: {
    flex: 1,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  questionContainer: {
    flex: 1,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  questionText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.xl,
    marginBottom: spacing['2xl'],
  },
  optionsContainer: {
    gap: spacing.base,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    flex: 1,
  },
  footer: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: buttonHeight.medium,
    borderRadius: 12,
    marginBottom: spacing.base,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  nextIcon: {
    marginLeft: spacing.sm,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});