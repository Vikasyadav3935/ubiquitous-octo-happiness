import { apiClient, APIResponse } from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: PlanPrice[];
  isPopular: boolean;
  metadata?: PlanMetadata;
}

export interface PlanPrice {
  id: string;
  interval: 'MONTH' | 'QUARTER' | 'YEAR';
  amount: number;
  currency: string;
  originalAmount?: number;
  savings?: number;
  savingsPercentage?: number;
}

export interface PlanMetadata {
  color?: string;
  badge?: string;
  maxLikes?: number;
  maxSuperLikes?: number;
  maxBoosts?: number;
}

export interface UserSubscription {
  id: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  metadata?: SubscriptionMetadata;
}

export interface SubscriptionMetadata {
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

export interface CreateSubscriptionRequest {
  priceId: string;
  paymentMethodId?: string;
  trialDays?: number;
}

export interface Boost {
  id: string;
  type: 'PROFILE' | 'SUPER_BOOST';
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  cost: number;
  currency: string;
  impressions?: number;
  profileViews?: number;
}

export interface PurchaseBoostRequest {
  type: 'PROFILE' | 'SUPER_BOOST';
  duration: number;
  paymentMethodId?: string;
}

export interface FeatureAccess {
  feature: string;
  hasAccess: boolean;
  limit?: number;
  used?: number;
  resetsAt?: string;
  requiresUpgrade: boolean;
}

export interface PricingInfo {
  plans: SubscriptionPlan[];
  addOns: AddOnPrice[];
  currency: string;
  region: string;
}

export interface AddOnPrice {
  id: string;
  name: string;
  description: string;
  type: 'SUPER_LIKES' | 'BOOSTS' | 'ONE_TIME_FEATURE';
  quantity: number;
  price: number;
  originalPrice?: number;
  savings?: number;
}

export interface PurchaseAddOnRequest {
  addOnId: string;
  quantity?: number;
  paymentMethodId?: string;
}

export interface PaymentHistory {
  id: string;
  type: 'SUBSCRIPTION' | 'BOOST' | 'SUPER_LIKES' | 'ADD_ON';
  description: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
  paymentDate: string;
  invoiceUrl?: string;
  refundReason?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'CARD' | 'PAYPAL' | 'GOOGLE_PAY' | 'APPLE_PAY';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  metadata?: PaymentMethodMetadata;
}

export interface PaymentMethodMetadata {
  stripePaymentMethodId?: string;
  fingerprint?: string;
  country?: string;
}

class PaymentService {
  async getSubscriptionPlans(): Promise<APIResponse<SubscriptionPlan[]>> {
    return await apiClient.get<SubscriptionPlan[]>('/payments/plans');
  }

  async getCurrentSubscription(): Promise<APIResponse<UserSubscription>> {
    return await apiClient.get<UserSubscription>('/payments/subscription');
  }

  async createSubscription(
    subscriptionData: CreateSubscriptionRequest
  ): Promise<APIResponse<UserSubscription>> {
    return await apiClient.post<UserSubscription>('/payments/subscription', subscriptionData);
  }

  async cancelSubscription(): Promise<APIResponse<UserSubscription>> {
    return await apiClient.delete<UserSubscription>('/payments/subscription');
  }

  async resumeSubscription(): Promise<APIResponse<UserSubscription>> {
    return await apiClient.post<UserSubscription>('/payments/subscription/resume');
  }

  async updateSubscription(priceId: string): Promise<APIResponse<UserSubscription>> {
    return await apiClient.put<UserSubscription>('/payments/subscription', { priceId });
  }

  async purchaseBoost(boostData: PurchaseBoostRequest): Promise<APIResponse<Boost>> {
    return await apiClient.post<Boost>('/payments/boost', boostData);
  }

  async getActiveBoosts(): Promise<APIResponse<Boost[]>> {
    return await apiClient.get<Boost[]>('/payments/boosts');
  }

  async checkFeatureAccess(feature: string): Promise<APIResponse<FeatureAccess>> {
    return await apiClient.get<FeatureAccess>(`/payments/features/${feature}`);
  }

  async getPricingInfo(): Promise<APIResponse<PricingInfo>> {
    return await apiClient.get<PricingInfo>('/payments/pricing');
  }

  async purchaseSuperLikes(
    quantity: number,
    paymentMethodId?: string
  ): Promise<APIResponse<{ success: boolean; superLikes: number }>> {
    return await apiClient.post('/payments/super-likes', {
      quantity,
      paymentMethodId,
    });
  }

  async purchaseAddOn(addOnData: PurchaseAddOnRequest): Promise<APIResponse<any>> {
    return await apiClient.post('/payments/add-ons', addOnData);
  }

  async getPaymentHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<APIResponse<{ payments: PaymentHistory[]; total: number; hasMore: boolean }>> {
    const endpoint = `/payments/history?page=${page}&limit=${limit}`;
    return await apiClient.get(endpoint);
  }

  async getPaymentMethods(): Promise<APIResponse<PaymentMethod[]>> {
    return await apiClient.get<PaymentMethod[]>('/payments/methods');
  }

  async addPaymentMethod(
    paymentMethodId: string,
    isDefault?: boolean
  ): Promise<APIResponse<PaymentMethod>> {
    return await apiClient.post<PaymentMethod>('/payments/methods', {
      paymentMethodId,
      isDefault,
    });
  }

  async updatePaymentMethod(
    methodId: string,
    isDefault: boolean
  ): Promise<APIResponse<PaymentMethod>> {
    return await apiClient.put<PaymentMethod>(`/payments/methods/${methodId}`, {
      isDefault,
    });
  }

  async deletePaymentMethod(methodId: string): Promise<APIResponse> {
    return await apiClient.delete(`/payments/methods/${methodId}`);
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<APIResponse<{
    clientSecret: string;
    paymentIntentId: string;
  }>> {
    return await apiClient.post('/payments/create-intent', {
      amount,
      currency,
    });
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<APIResponse<{ status: string }>> {
    return await apiClient.post('/payments/confirm', {
      paymentIntentId,
      paymentMethodId,
    });
  }

  async requestRefund(
    paymentId: string,
    reason: string,
    amount?: number
  ): Promise<APIResponse<{ refundId: string; status: string }>> {
    return await apiClient.post(`/payments/${paymentId}/refund`, {
      reason,
      amount,
    });
  }

  async getInvoice(invoiceId: string): Promise<APIResponse<{ invoiceUrl: string }>> {
    return await apiClient.get<{ invoiceUrl: string }>(`/payments/invoices/${invoiceId}`);
  }

  // Helper methods
  async hasFeatureAccess(feature: string): Promise<boolean> {
    const response = await this.checkFeatureAccess(feature);
    return response.success && response.data?.hasAccess === true;
  }

  async getRemainingFeatureUsage(feature: string): Promise<number> {
    const response = await this.checkFeatureAccess(feature);
    if (response.success && response.data) {
      const { limit, used } = response.data;
      if (limit && used !== undefined) {
        return Math.max(0, limit - used);
      }
    }
    return 0;
  }

  calculateSavings(originalAmount: number, discountedAmount: number): {
    savings: number;
    percentage: number;
  } {
    const savings = originalAmount - discountedAmount;
    const percentage = Math.round((savings / originalAmount) * 100);
    
    return {
      savings,
      percentage,
    };
  }

  formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount / 100); // Assuming amounts are in cents
  }

  getPlanRecommendation(plans: SubscriptionPlan[]): SubscriptionPlan | null {
    // Find the most popular plan
    const popularPlan = plans.find(plan => plan.isPopular);
    if (popularPlan) return popularPlan;

    // Fallback to quarterly plan if available
    const quarterlyPlan = plans.find(plan => 
      plan.prices.some(price => price.interval === 'QUARTER')
    );
    if (quarterlyPlan) return quarterlyPlan;

    // Return the first plan as final fallback
    return plans[0] || null;
  }

  isSubscriptionActive(subscription?: UserSubscription): boolean {
    if (!subscription) return false;
    
    const now = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    
    return subscription.status === 'ACTIVE' && endDate > now;
  }

  getSubscriptionTimeRemaining(subscription?: UserSubscription): {
    days: number;
    hours: number;
    minutes: number;
  } {
    if (!subscription) return { days: 0, hours: 0, minutes: 0 };

    const now = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }
}

export const paymentService = new PaymentService();