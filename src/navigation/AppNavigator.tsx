import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatsScreen from '../screens/ChatsScreen';
import WhoLikedYouScreen from '../screens/WhoLikedYouScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ManagePhotosScreen from '../screens/ManagePhotosScreen';
import PrivacySafetyScreen from '../screens/PrivacySafetyScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import PremiumFeaturesScreen from '../screens/PremiumFeaturesScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import BlockReportUserScreen from '../screens/BlockReportUserScreen';
import MediaViewerScreen from '../screens/MediaViewerScreen';
import VideoCallScreen from '../screens/VideoCallScreen';

import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'WhoLikedYou') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: typography.fontFamily.medium,
          marginTop: -4,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Discover' }}
      />
      <Tab.Screen 
        name="WhoLikedYou" 
        component={WhoLikedYouScreen}
        options={{ tabBarLabel: 'Likes' }}
      />
      <Tab.Screen 
        name="Chats" 
        component={ChatsScreen}
        options={{ tabBarLabel: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name="LoginWithOTP" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="OTPVerification" 
          component={OTPVerificationScreen} 
        />
        <Stack.Screen 
          name="ProfileSetup" 
          component={ProfileSetupScreen} 
        />
        <Stack.Screen 
          name="QuestionsFlow" 
          component={QuestionsScreen} 
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainTabNavigator} 
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
        />
        <Stack.Screen 
          name="ManagePhotos" 
          component={ManagePhotosScreen}
        />
        <Stack.Screen 
          name="PrivacySafety" 
          component={PrivacySafetyScreen}
        />
        <Stack.Screen 
          name="NotificationSettings" 
          component={NotificationSettingsScreen}
        />
        <Stack.Screen 
          name="Premium" 
          component={PremiumFeaturesScreen}
        />
        <Stack.Screen 
          name="ChatDetail" 
          component={ChatDetailScreen}
        />
        <Stack.Screen 
          name="ChatSettings" 
          component={ChatSettingsScreen}
        />
        <Stack.Screen 
          name="BlockReportUser" 
          component={BlockReportUserScreen}
        />
        <Stack.Screen 
          name="SharedMedia" 
          component={MediaViewerScreen}
        />
        <Stack.Screen 
          name="VideoCall" 
          component={VideoCallScreen}
          options={{
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}