import { apiClient, APIResponse } from './api';
import { UserProfile } from './authService';

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    profile: UserProfile;
    isOnline?: boolean;
  };
  lastMessage?: {
    id: string;
    content: string;
    messageType: string;
    createdAt: string;
    senderId: string;
    isOwn: boolean;
  };
  lastMessageAt?: string;
  isRead?: boolean;
  unreadCount?: number;
  createdAt: string;
}

export interface ConversationParticipant {
  userId: string;
  profile: UserProfile;
  joinedAt: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LOCATION' | 'GIF';
  content?: string;
  mediaUrl?: string;
  mediaMetadata?: MediaMetadata;
  isRead: boolean;
  isEdited: boolean;
  replyTo?: string;
  reactions: MessageReaction[];
  status: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface MediaMetadata {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number; // For audio/video
  width?: number; // For images/video
  height?: number; // For images/video
  thumbnail?: string;
}

export interface MessageReaction {
  id: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface SendMessageRequest {
  messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LOCATION' | 'GIF';
  content?: string;
  mediaUrl?: string;
  mediaMetadata?: MediaMetadata;
  replyTo?: string;
}

export interface ConversationSettings {
  id: string;
  conversationId: string;
  notifications: boolean;
  disappearingMessages: {
    enabled: boolean;
    duration: number; // in seconds
  };
  autoDownload: {
    images: boolean;
    videos: boolean;
    audio: boolean;
  };
  readReceipts: boolean;
  typingIndicators: boolean;
}

export interface SearchMessagesRequest {
  query: string;
  messageType?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LOCATION' | 'GIF';
  dateFrom?: string;
  dateTo?: string;
  senderId?: string;
}

export interface SearchMessagesResult {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface UnreadCount {
  total: number;
  conversations: Array<{
    conversationId: string;
    count: number;
  }>;
}

class ChatService {
  async getConversations(
    page: number = 1, 
    limit: number = 20
  ): Promise<APIResponse<{ conversations: Conversation[]; total: number; hasMore: boolean }>> {
    const endpoint = `/chats/conversations?page=${page}&limit=${limit}`;
    return await apiClient.get(endpoint);
  }

  async getConversation(conversationId: string): Promise<APIResponse<Conversation>> {
    return await apiClient.get<Conversation>(`/chats/conversations/${conversationId}`);
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<APIResponse<{ messages: Message[]; total: number; hasMore: boolean }>> {
    const endpoint = `/chats/conversations/${conversationId}/messages?page=${page}&limit=${limit}`;
    return await apiClient.get(endpoint);
  }

  async sendMessage(
    conversationId: string,
    messageData: SendMessageRequest
  ): Promise<APIResponse<Message>> {
    return await apiClient.post<Message>(
      `/chats/conversations/${conversationId}/messages`,
      messageData
    );
  }

  async markMessagesAsRead(conversationId: string): Promise<APIResponse> {
    return await apiClient.put(`/chats/conversations/${conversationId}/read`);
  }

  async deleteMessage(messageId: string): Promise<APIResponse> {
    return await apiClient.delete(`/chats/messages/${messageId}`);
  }

  async editMessage(messageId: string, content: string): Promise<APIResponse<Message>> {
    return await apiClient.put<Message>(`/chats/messages/${messageId}`, { content });
  }

  async getUnreadCount(): Promise<APIResponse<UnreadCount>> {
    return await apiClient.get<UnreadCount>('/chats/unread-count');
  }

  async searchMessages(
    conversationId: string,
    searchParams: SearchMessagesRequest
  ): Promise<APIResponse<SearchMessagesResult>> {
    const queryParams = new URLSearchParams();
    queryParams.append('query', searchParams.query);
    
    if (searchParams.messageType) {
      queryParams.append('messageType', searchParams.messageType);
    }
    if (searchParams.dateFrom) {
      queryParams.append('dateFrom', searchParams.dateFrom);
    }
    if (searchParams.dateTo) {
      queryParams.append('dateTo', searchParams.dateTo);
    }
    if (searchParams.senderId) {
      queryParams.append('senderId', searchParams.senderId);
    }

    const endpoint = `/chats/conversations/${conversationId}/search?${queryParams.toString()}`;
    return await apiClient.get<SearchMessagesResult>(endpoint);
  }

  async addReaction(messageId: string, emoji: string): Promise<APIResponse<MessageReaction>> {
    return await apiClient.post<MessageReaction>(`/chats/messages/${messageId}/reactions`, {
      emoji,
    });
  }

  async removeReaction(messageId: string, reactionId: string): Promise<APIResponse> {
    return await apiClient.delete(`/chats/messages/${messageId}/reactions/${reactionId}`);
  }

  async blockUser(userId: string): Promise<APIResponse> {
    return await apiClient.post('/chats/block', { userId });
  }

  async unblockUser(userId: string): Promise<APIResponse> {
    return await apiClient.post('/chats/unblock', { userId });
  }

  async reportUser(
    userId: string, 
    conversationId: string,
    reason: string,
    details?: string
  ): Promise<APIResponse> {
    return await apiClient.post('/chats/report', {
      userId,
      conversationId,
      reason,
      details,
    });
  }

  async getConversationSettings(conversationId: string): Promise<APIResponse<ConversationSettings>> {
    return await apiClient.get<ConversationSettings>(`/chats/conversations/${conversationId}/settings`);
  }

  async updateConversationSettings(
    conversationId: string,
    settings: Partial<ConversationSettings>
  ): Promise<APIResponse<ConversationSettings>> {
    return await apiClient.put<ConversationSettings>(
      `/chats/conversations/${conversationId}/settings`,
      settings
    );
  }

  async getSharedMedia(
    conversationId: string,
    mediaType?: 'IMAGE' | 'VIDEO' | 'AUDIO',
    page: number = 1,
    limit: number = 20
  ): Promise<APIResponse<{ media: Message[]; total: number; hasMore: boolean }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (mediaType) {
      queryParams.append('type', mediaType);
    }

    const endpoint = `/chats/conversations/${conversationId}/media?${queryParams.toString()}`;
    return await apiClient.get(endpoint);
  }

  async exportConversation(conversationId: string): Promise<APIResponse<{ exportUrl: string }>> {
    return await apiClient.post(`/chats/conversations/${conversationId}/export`);
  }

  async clearConversationHistory(conversationId: string): Promise<APIResponse> {
    return await apiClient.delete(`/chats/conversations/${conversationId}/messages`);
  }

  // Helper method to format message timestamp
  formatMessageTime(timestamp: string): string {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    if (messageDay.getTime() === today.getTime()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else if (messageDay >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  // Helper method to group messages by date
  groupMessagesByDate(messages: Message[]): { [date: string]: Message[] } {
    const grouped: { [date: string]: Message[] } = {};
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dateKey = messageDate.toLocaleDateString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(message);
    });

    return grouped;
  }
}

export const chatService = new ChatService();