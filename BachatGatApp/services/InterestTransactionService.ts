/**
 * Interest Transaction Service
 * Handles all interest transaction-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface InterestTransaction {
  itId: number;
  sgId: number;
  monthId: number;
  memberId: number;
  memberName?: string;
  interestAmount: number;
  depositInterestAmount: number;
  paymentType: number; // 1: Cash, 2: Bank
  isPaid: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface UpdateInterestTransactionRequest {
  itId: number;
  paymentType: number;
  depositInterestAmount: number;
}

/**
 * Interest Transaction Service Class
 */
class InterestTransactionService {
  /**
   * Get interest pending by saving group ID
   */
  async getInterestPendingBySGID(sgId: number): Promise<APIResponse<InterestTransaction[]>> {
    try {
      return await apiService.get(`IntrestTrasaction/IntrestPending/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get interest pending by member ID
   */
  async getInterestPendingByMemberID(sgId: number, memberId: number): Promise<APIResponse<InterestTransaction[]>> {
    try {
      return await apiService.get(`IntrestTrasaction/IntrestPendingByMember/${sgId}/${memberId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update interest transaction
   */
  async updateInterestTransaction(data: UpdateInterestTransactionRequest[]): Promise<APIResponse> {
    try {
      return await apiService.put('IntrestTrasaction/UpdateIntrestTrasaction', data);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const interestTransactionService = new InterestTransactionService();

export default interestTransactionService;
