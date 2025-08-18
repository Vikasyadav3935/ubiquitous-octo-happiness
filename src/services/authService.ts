import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, APIResponse } from './api';

export interface User {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  profile?: UserProfile;
  settings?: UserSettings;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';
  bio?: string;
  occupation?: string;
  company?: string;
  education?: string;
  height?: number;
  interests: Interest[];
  profileCompleteness: number;
  isVerified: boolean;
  photos: ProfilePhoto[];
  answers: QuestionAnswer[];
  latitude?: number;
  longitude?: number;
}

export interface Interest {
  id: string;
  name: string;
  category?: string;
}

export interface QuestionAnswer {
  id: string;
  answer: string;
  question: Question;
}

export interface Question {
  id: string;
  text: string;
  category?: string;
  type: string;
  options?: any;
}

export interface UserSettings {
  id: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  newMatchNotifications: boolean;
  messageNotifications: boolean;
  likeNotifications: boolean;
  superLikeNotifications: boolean;
  showAge: boolean;
  showDistance: boolean;
  showOnlineStatus: boolean;
  hideFromContacts: boolean;
  discoveryEnabled: boolean;
}

export interface ProfilePhoto {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

class AuthService {
  private static TOKEN_KEY = 'authToken';
  private static USER_KEY = 'userData';

  async sendOTP(phoneNumber: string, purpose?: string): Promise<APIResponse> {
    console.log('AuthService: Sending OTP to:', phoneNumber);
    const response = await apiClient.post('/auth/send-otp', {
      phoneNumber,
      purpose: purpose || 'PHONE_VERIFICATION',
    });
    
    console.log('AuthService: Send OTP response:', JSON.stringify(response, null, 2));
    return response;
  }

  async verifyOTP(phoneNumber: string, code: string, purpose?: string): Promise<APIResponse<AuthResponse>> {
    console.log('AuthService: Verifying OTP for:', phoneNumber, 'code:', code);
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
      phoneNumber,
      code,
      purpose: purpose || 'PHONE_VERIFICATION',
    });
    
    console.log('AuthService: Verify OTP response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data?.token) {
      console.log('AuthService: Storing auth data...');
      await this.storeAuthData(response.data.token, response.data.user);
    } else {
      console.log('AuthService: No token in response or request failed');
    }

    return response;
  }

  async resendOTP(phoneNumber: string, purpose?: string): Promise<APIResponse> {
    return await apiClient.post('/auth/resend-otp', {
      phoneNumber,
      purpose: purpose || 'PHONE_VERIFICATION',
    });
  }

  async getCurrentUser(): Promise<APIResponse<User>> {
    const response = await apiClient.get<User>('/auth/me');
    
    if (response.success && response.data) {
      await this.storeUserData(response.data);
    }

    return response;
  }

  async refreshToken(): Promise<APIResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token');
    
    if (response.success && response.data?.token) {
      await AsyncStorage.setItem(AuthService.TOKEN_KEY, response.data.token);
    }

    return response;
  }

  async logout(): Promise<APIResponse> {
    const response = await apiClient.post('/auth/logout');
    await this.clearAuthData();
    return response;
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AuthService.TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(AuthService.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  }

  private async storeAuthData(token: string, user?: User): Promise<void> {
    try {
      await AsyncStorage.setItem(AuthService.TOKEN_KEY, token);
      if (user) {
        await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Failed to store auth data:', error);
    }
  }

  private async storeUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AuthService.TOKEN_KEY, AuthService.USER_KEY]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }
}

export const authService = new AuthService();