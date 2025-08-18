import { apiClient, APIResponse } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  isRead: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'MATCH'
  | 'LIKE'
  | 'SUPER_LIKE'
  | 'MESSAGE'
  | 'PROFILE_VIEW'
  | 'BOOST_ACTIVE'
  | 'BOOST_EXPIRED'
  | 'SUBSCRIPTION_RENEWAL'
  | 'SUBSCRIPTION_EXPIRED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'SAFETY_ALERT'
  | 'PROMO'
  | 'SYSTEM';

export interface NotificationData {
  matchId?: string;
  userId?: string;
  conversationId?: string;
  messageId?: string;
  boostId?: string;
  subscriptionId?: string;
  profileId?: string;
  actionUrl?: string;
  imageUrl?: string;
  customData?: Record<string, any>;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  categories: NotificationCategorySettings;
  quietHours: QuietHoursSettings;
  frequency: NotificationFrequency;
}

export interface NotificationCategorySettings {
  matches: boolean;
  likes: boolean;
  superLikes: boolean;
  messages: boolean;
  profileViews: boolean;
  boosts: boolean;
  subscriptions: boolean;
  safety: boolean;
  promotions: boolean;
  system: boolean;
}

export interface QuietHoursSettings {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  weekdays: boolean[];
}

export interface NotificationFrequency {
  immediate: NotificationType[];
  batched: NotificationType[];
  digest: NotificationType[];
  batchInterval: number; // minutes
  digestInterval: 'DAILY' | 'WEEKLY';
}

export interface PushToken {
  token: string;
  platform: 'IOS' | 'ANDROID' | 'WEB';
  deviceId: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<string, number>;
  readRate: number;
  averageReadTime: number; // minutes
}

export interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduleAt?: string;
  expiresAt?: string;
}

export interface BulkNotificationRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduleAt?: string;
}

class NotificationService {
  private static PUSH_TOKEN_KEY = 'pushToken';
  private static SETTINGS_KEY = 'notificationSettings';

  async getNotifications(
    page: number = 1,
    limit: number = 20,
    type?: NotificationType,
    unreadOnly?: boolean
  ): Promise<APIResponse<{ 
    notifications: Notification[]; 
    total: number; 
    unread: number;
    hasMore: boolean;
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (type) {
      queryParams.append('type', type);
    }
    if (unreadOnly) {
      queryParams.append('unreadOnly', 'true');
    }

    const endpoint = `/notifications?${queryParams.toString()}`;
    return await apiClient.get(endpoint);
  }

  async markAsRead(notificationIds: string[]): Promise<APIResponse> {
    return await apiClient.put('/notifications/read', { notificationIds });
  }

  async markAllAsRead(): Promise<APIResponse> {
    return await apiClient.put('/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<APIResponse> {
    return await apiClient.delete(`/notifications/${notificationId}`);
  }

  async deleteAllNotifications(): Promise<APIResponse> {
    return await apiClient.delete('/notifications');
  }

  async addPushToken(
    token: string,
    platform: 'IOS' | 'ANDROID' | 'WEB',
    deviceId: string
  ): Promise<APIResponse<PushToken>> {
    const response = await apiClient.post<PushToken>('/notifications/push-token', {
      token,
      platform,
      deviceId,
    });

    if (response.success) {
      await this.storePushToken(token);
    }

    return response;
  }

  async removePushToken(token?: string): Promise<APIResponse> {
    const tokenToRemove = token || await this.getStoredPushToken();
    
    if (!tokenToRemove) {
      return { success: false, error: 'No push token found' };
    }

    const response = await apiClient.delete('/notifications/push-token', {
      token: tokenToRemove,
    });

    if (response.success) {
      await this.clearStoredPushToken();
    }

    return response;
  }

  async getPushTokens(): Promise<APIResponse<PushToken[]>> {
    return await apiClient.get<PushToken[]>('/notifications/push-tokens');
  }

  async getNotificationStats(): Promise<APIResponse<NotificationStats>> {
    return await apiClient.get<NotificationStats>('/notifications/stats');
  }

  async getNotificationSettings(): Promise<APIResponse<NotificationSettings>> {
    return await apiClient.get<NotificationSettings>('/notifications/settings');
  }

  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<APIResponse<NotificationSettings>> {
    const response = await apiClient.put<NotificationSettings>(
      '/notifications/settings', 
      settings
    );

    if (response.success && response.data) {
      await this.storeSettings(response.data);
    }

    return response;
  }

  async sendTestNotification(type: NotificationType): Promise<APIResponse> {
    return await apiClient.post('/notifications/test', { type });
  }

  async scheduleNotification(
    notificationData: SendNotificationRequest
  ): Promise<APIResponse<Notification>> {
    return await apiClient.post<Notification>('/notifications/schedule', notificationData);
  }

  async cancelScheduledNotification(notificationId: string): Promise<APIResponse> {
    return await apiClient.delete(`/notifications/scheduled/${notificationId}`);
  }

  // Bulk operations (admin/system use)
  async sendBulkNotification(
    bulkData: BulkNotificationRequest
  ): Promise<APIResponse<{ sent: number; failed: number }>> {
    return await apiClient.post('/notifications/bulk', bulkData);
  }

  // Local storage methods
  async getStoredPushToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(NotificationService.PUSH_TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  async storePushToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(NotificationService.PUSH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store push token:', error);
    }
  }

  async clearStoredPushToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NotificationService.PUSH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear push token:', error);
    }
  }

  async getStoredSettings(): Promise<NotificationSettings | null> {
    try {
      const settings = await AsyncStorage.getItem(NotificationService.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      return null;
    }
  }

  async storeSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        NotificationService.SETTINGS_KEY, 
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Failed to store notification settings:', error);
    }
  }

  // Helper methods
  isInQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check if current day is enabled
    if (!settings.quietHours.weekdays[currentDay]) return false;

    const { startTime, endTime } = settings.quietHours;

    // Handle case where quiet hours span midnight
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  shouldShowNotification(
    notification: Notification,
    settings: NotificationSettings
  ): boolean {
    // Check if notifications are globally disabled
    if (!settings.pushEnabled) return false;

    // Check if in quiet hours
    if (this.isInQuietHours(settings)) {
      // Allow urgent notifications during quiet hours
      return notification.priority === 'URGENT';
    }

    // Check category-specific settings
    const categoryMap: Record<NotificationType, keyof NotificationCategorySettings> = {
      'MATCH': 'matches',
      'LIKE': 'likes',
      'SUPER_LIKE': 'superLikes',
      'MESSAGE': 'messages',
      'PROFILE_VIEW': 'profileViews',
      'BOOST_ACTIVE': 'boosts',
      'BOOST_EXPIRED': 'boosts',
      'SUBSCRIPTION_RENEWAL': 'subscriptions',
      'SUBSCRIPTION_EXPIRED': 'subscriptions',
      'VERIFICATION_APPROVED': 'system',
      'VERIFICATION_REJECTED': 'system',
      'SAFETY_ALERT': 'safety',
      'PROMO': 'promotions',
      'SYSTEM': 'system',
    };

    const category = categoryMap[notification.type];
    return category ? settings.categories[category] : true;
  }

  formatNotificationTime(timestamp: string): string {
    const notificationDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return notificationDate.toLocaleDateString();
    }
  }

  getNotificationIcon(type: NotificationType): string {
    const iconMap: Record<NotificationType, string> = {
      'MATCH': 'heart',
      'LIKE': 'heart-outline',
      'SUPER_LIKE': 'star',
      'MESSAGE': 'chatbubble',
      'PROFILE_VIEW': 'eye',
      'BOOST_ACTIVE': 'flash',
      'BOOST_EXPIRED': 'flash-outline',
      'SUBSCRIPTION_RENEWAL': 'card',
      'SUBSCRIPTION_EXPIRED': 'card-outline',
      'VERIFICATION_APPROVED': 'checkmark-circle',
      'VERIFICATION_REJECTED': 'close-circle',
      'SAFETY_ALERT': 'shield',
      'PROMO': 'gift',
      'SYSTEM': 'information-circle',
    };

    return iconMap[type] || 'notifications';
  }

  getPriorityColor(priority: string): string {
    const colorMap: Record<string, string> = {
      'LOW': '#6C5CE7',
      'MEDIUM': '#74B9FF',
      'HIGH': '#FDCB6E',
      'URGENT': '#E17055',
    };

    return colorMap[priority] || '#B2BEC3';
  }

  groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
    const grouped: Record<string, Notification[]> = {};

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)) {
        dateKey = date.toLocaleDateString([], { weekday: 'long' });
      } else {
        dateKey = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(notification);
    });

    return grouped;
  }
}

export const notificationService = new NotificationService();