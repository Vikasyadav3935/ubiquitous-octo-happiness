# Professional Dating App

A modern, professional dating application built with React Native and Expo, featuring personality-based matching and premium features.

## ✨ Features

### 🎨 Professional Design
- Clean, modern UI without gradients
- Rubik font integration with all font weights
- Consistent design system with proper spacing and typography
- Production-ready interface

### 📱 Complete User Flow
1. **Welcome Screen** - Beautiful onboarding with feature highlights
2. **Login with OTP** - Phone number authentication
3. **OTP Verification** - 6-digit code verification with timer
4. **Profile Setup** - Personal information and photo upload
5. **Questions Flow** - Personality matching questionnaire covering:
   - Personality traits and social energy
   - Beliefs and spirituality
   - Lifestyle preferences
   - Values and relationship goals
   - Communication style
6. **Main App** - 4-tab navigation interface

### 🚀 Main App Features
- **Discover Tab** - Smart matching with compatibility scoring
- **Likes Tab** - Who liked you with premium integration
- **Messages Tab** - Secure chat interface
- **Profile Tab** - Settings and account management

### 💎 Premium Features
- Blurred profiles in "Who Liked You" section
- Unlimited likes and super likes
- Advanced matching preferences
- Premium indicators and upgrade prompts

## 🛠 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **Expo Google Fonts** (Rubik family)
- **Ionicons** for consistent iconography

## 📁 Project Structure

```
src/
├── constants/
│   ├── colors.ts      # Color palette
│   ├── spacing.ts     # Spacing and sizing constants
│   └── typography.ts  # Font families and sizes
├── navigation/
│   └── AppNavigator.tsx # Navigation configuration
└── screens/
    ├── WelcomeScreen.tsx
    ├── LoginScreen.tsx
    ├── OTPVerificationScreen.tsx
    ├── ProfileSetupScreen.tsx
    ├── QuestionsScreen.tsx
    ├── HomeScreen.tsx
    ├── ChatsScreen.tsx
    ├── WhoLikedYouScreen.tsx
    ├── ProfileScreen.tsx
    └── AboutScreen.tsx
```

## 🎨 Design System

### Colors
- Primary: #FF4458 (Dating app red)
- Secondary: #6C5CE7 (Purple)
- Accent: #74B9FF (Blue)
- Background: #FFFFFF
- Surface: #F8F9FA

### Typography
- Font Family: Rubik (Light, Regular, Medium, SemiBold, Bold)
- Consistent sizing and line heights
- Proper text hierarchy

### Components
- Reduced button heights (40-52px)
- Compact input fields (44-48px)
- Professional spacing system
- Consistent shadows and elevation

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on device**
   - Scan QR code with Expo Go app
   - Or use `npm run android` / `npm run ios`

## 📱 Screens Overview

### Authentication Flow
- **Welcome**: Feature introduction and call-to-action
- **Login**: Phone number input with validation
- **OTP**: 6-digit verification with resend functionality

### Onboarding
- **Profile Setup**: Personal information and photo upload
- **Questions**: Personality assessment for matching

### Main Application
- **Home/Discover**: Swipe interface with match scoring
- **Who Liked You**: Premium feature with upgrade prompts
- **Messages**: Chat list with online indicators
- **Profile**: Settings, preferences, and account management

## 🎯 Key Features Implemented

✅ Professional UI/UX design  
✅ Complete authentication flow  
✅ Personality-based matching questions  
✅ Smart compatibility scoring  
✅ Premium feature integration  
✅ Responsive design  
✅ Type-safe TypeScript implementation  
✅ Production-ready navigation  
✅ Consistent design system  
✅ Professional spacing and typography  

## 📄 License

This project is created for educational and portfolio purposes.

---

**Built with ❤️ using React Native & Expo**