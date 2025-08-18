import { apiClient, APIResponse } from './api';
import { UserProfile } from './authService';

export interface CreateProfileRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';
  bio?: string;
  occupation?: string;
  company?: string;
  education?: string;
  height?: number;
  interests?: string[];
  latitude?: number;
  longitude?: number;
}

export interface UpdateProfileRequest extends Partial<CreateProfileRequest> {}

export interface UserSettings {
  id: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  discovery: DiscoverySettings;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  matches: boolean;
  messages: boolean;
  likes: boolean;
  superLikes: boolean;
  marketing: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface PrivacySettings {
  showAge: boolean;
  showDistance: boolean;
  showLastSeen: boolean;
  onlyMatches: boolean;
  incognito: boolean;
}

export interface DiscoverySettings {
  ageRange: {
    min: number;
    max: number;
  };
  distanceRange: number;
  interestedIn: ('MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER')[];
  showMe: boolean;
}

export interface UserStats {
  profileViews: number;
  likes: number;
  matches: number;
  superLikes: number;
  messagesReceived: number;
  messagesSent: number;
  profileCompleteness: number;
}

export interface MatchPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  distanceRange: number;
  interestedIn: ('MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER')[];
  dealBreakers: string[];
  preferredInterests: string[];
  preferredEducation?: string;
  preferredOccupation?: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
}

export interface SearchFilters {
  ageRange?: {
    min: number;
    max: number;
  };
  distanceRange?: number;
  interests?: string[];
  education?: string;
  occupation?: string;
  verified?: boolean;
}

class ProfileService {
  async getProfile(): Promise<APIResponse<UserProfile>> {
    return await apiClient.get<UserProfile>('/users/profile');
  }

  async createProfile(data: CreateProfileRequest): Promise<APIResponse<UserProfile>> {
    return await apiClient.post<UserProfile>('/users/profile', data);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<APIResponse<UserProfile>> {
    return await apiClient.put<UserProfile>('/users/profile', data);
  }

  async getSettings(): Promise<APIResponse<UserSettings>> {
    return await apiClient.get<UserSettings>('/users/settings');
  }

  async updateSettings(data: Partial<UserSettings>): Promise<APIResponse<UserSettings>> {
    return await apiClient.put<UserSettings>('/users/settings', data);
  }

  async getStats(): Promise<APIResponse<UserStats>> {
    return await apiClient.get<UserStats>('/users/stats');
  }

  async deleteAccount(): Promise<APIResponse> {
    return await apiClient.delete('/users/account');
  }

  async getProfileById(userId: string): Promise<APIResponse<UserProfile>> {
    return await apiClient.get<UserProfile>(`/profiles/${userId}`);
  }

  async getMatchPreferences(userId: string): Promise<APIResponse<MatchPreferences>> {
    return await apiClient.get<MatchPreferences>(`/profiles/${userId}/preferences`);
  }

  async updateMatchPreferences(
    userId: string, 
    preferences: Partial<MatchPreferences>
  ): Promise<APIResponse<MatchPreferences>> {
    return await apiClient.put<MatchPreferences>(
      `/profiles/${userId}/preferences`, 
      preferences
    );
  }

  async getAllInterests(): Promise<APIResponse<Interest[]>> {
    return await apiClient.get<Interest[]>('/profiles/interests/all');
  }

  async searchProfiles(filters?: SearchFilters): Promise<APIResponse<UserProfile[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.ageRange) {
        queryParams.append('minAge', filters.ageRange.min.toString());
        queryParams.append('maxAge', filters.ageRange.max.toString());
      }
      if (filters.distanceRange) {
        queryParams.append('distance', filters.distanceRange.toString());
      }
      if (filters.interests && filters.interests.length > 0) {
        queryParams.append('interests', filters.interests.join(','));
      }
      if (filters.education) {
        queryParams.append('education', filters.education);
      }
      if (filters.occupation) {
        queryParams.append('occupation', filters.occupation);
      }
      if (filters.verified !== undefined) {
        queryParams.append('verified', filters.verified.toString());
      }
    }

    const endpoint = queryParams.toString() 
      ? `/profiles/search/profiles?${queryParams.toString()}`
      : '/profiles/search/profiles';

    return await apiClient.get<UserProfile[]>(endpoint);
  }
}

export const profileService = new ProfileService();