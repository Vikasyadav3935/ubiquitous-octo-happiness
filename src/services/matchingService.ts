import { apiClient, APIResponse } from './api';
import { UserProfile } from './authService';

export interface DiscoveryProfile extends UserProfile {
  distance?: number;
  matchPercentage: number;
  commonInterests: string[];
}

export interface MatchAction {
  userId: string;
  action: 'LIKE' | 'PASS' | 'SUPER_LIKE';
}

export interface MatchResult {
  isMatch: boolean;
  match?: Match;
  message: string;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  profile: UserProfile;
  createdAt: string;
  lastActivity?: string;
  conversationId?: string;
}

export interface LikeProfile {
  id: string;
  userId: string;
  profile: UserProfile;
  likeType: 'LIKE' | 'SUPER_LIKE';
  createdAt: string;
  isVisible: boolean; // For premium features
}

export interface DiscoveryFilters {
  ageRange?: {
    min: number;
    max: number;
  };
  distanceRange?: number;
  interestedIn?: ('MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER')[];
  interests?: string[];
  verified?: boolean;
  hasPhotos?: boolean;
}

class MatchingService {
  async getDiscoveryProfiles(filters?: DiscoveryFilters): Promise<APIResponse<DiscoveryProfile[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.ageRange) {
        queryParams.append('minAge', filters.ageRange.min.toString());
        queryParams.append('maxAge', filters.ageRange.max.toString());
      }
      if (filters.distanceRange) {
        queryParams.append('distance', filters.distanceRange.toString());
      }
      if (filters.interestedIn && filters.interestedIn.length > 0) {
        queryParams.append('interestedIn', filters.interestedIn.join(','));
      }
      if (filters.interests && filters.interests.length > 0) {
        queryParams.append('interests', filters.interests.join(','));
      }
      if (filters.verified !== undefined) {
        queryParams.append('verified', filters.verified.toString());
      }
      if (filters.hasPhotos !== undefined) {
        queryParams.append('hasPhotos', filters.hasPhotos.toString());
      }
    }

    const endpoint = queryParams.toString() 
      ? `/matches/discovery?${queryParams.toString()}`
      : '/matches/discovery';

    return await apiClient.get<DiscoveryProfile[]>(endpoint);
  }

  async likeProfile(userId: string): Promise<APIResponse<MatchResult>> {
    return await apiClient.post<MatchResult>('/matches/like', { userId });
  }

  async passProfile(userId: string): Promise<APIResponse> {
    return await apiClient.post('/matches/pass', { userId });
  }

  async superLikeProfile(userId: string): Promise<APIResponse<MatchResult>> {
    return await apiClient.post<MatchResult>('/matches/super-like', { userId });
  }

  async getWhoLikedMe(): Promise<APIResponse<LikeProfile[]>> {
    return await apiClient.get<LikeProfile[]>('/matches/who-liked-me');
  }

  async getMatches(): Promise<APIResponse<Match[]>> {
    return await apiClient.get<Match[]>('/matches/matches');
  }

  async undoLastAction(): Promise<APIResponse> {
    return await apiClient.post('/matches/undo');
  }

  async getMatchById(matchId: string): Promise<APIResponse<Match>> {
    return await apiClient.get<Match>(`/matches/${matchId}`);
  }

  async unmatch(matchId: string): Promise<APIResponse> {
    return await apiClient.delete(`/matches/${matchId}`);
  }

  // Helper method to handle batch actions
  async performBatchActions(actions: MatchAction[]): Promise<APIResponse<MatchResult[]>> {
    const results: MatchResult[] = [];
    
    for (const action of actions) {
      let result: APIResponse<MatchResult>;
      
      switch (action.action) {
        case 'LIKE':
          result = await this.likeProfile(action.userId);
          break;
        case 'SUPER_LIKE':
          result = await this.superLikeProfile(action.userId);
          break;
        case 'PASS':
          const passResult = await this.passProfile(action.userId);
          result = {
            success: passResult.success,
            data: {
              isMatch: false,
              message: passResult.message || 'Profile passed',
            },
            error: passResult.error,
          };
          break;
        default:
          continue;
      }
      
      if (result.success && result.data) {
        results.push(result.data);
      }
    }

    return {
      success: true,
      data: results,
    };
  }

  // Helper method to calculate match score
  calculateMatchScore(
    userProfile: UserProfile, 
    targetProfile: UserProfile
  ): number {
    let score = 0;
    let factors = 0;

    // Common interests (40% weight)
    const commonInterests = userProfile.interests.filter(interest =>
      targetProfile.interests.includes(interest)
    );
    score += (commonInterests.length / Math.max(userProfile.interests.length, 1)) * 40;
    factors += 40;

    // Age compatibility (20% weight)
    const userAge = this.calculateAge(userProfile.dateOfBirth);
    const targetAge = this.calculateAge(targetProfile.dateOfBirth);
    const ageDifference = Math.abs(userAge - targetAge);
    const ageScore = Math.max(0, (10 - ageDifference) / 10) * 20;
    score += ageScore;
    factors += 20;

    // Education match (20% weight)
    if (userProfile.education && targetProfile.education) {
      if (userProfile.education === targetProfile.education) {
        score += 20;
      } else if (this.isSimilarEducation(userProfile.education, targetProfile.education)) {
        score += 10;
      }
    }
    factors += 20;

    // Location proximity (20% weight) - would need actual distance calculation
    // For now, we'll assume a base score
    score += 10;
    factors += 20;

    return Math.round((score / factors) * 100);
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private isSimilarEducation(education1: string, education2: string): boolean {
    const educationLevels = [
      'High School',
      'Some College',
      'Bachelor\'s Degree',
      'Master\'s Degree',
      'PhD/Doctorate'
    ];

    const level1 = educationLevels.indexOf(education1);
    const level2 = educationLevels.indexOf(education2);

    return Math.abs(level1 - level2) <= 1;
  }
}

export const matchingService = new MatchingService();