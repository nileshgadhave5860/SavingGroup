/**
 * Saving Transaction Service
 * Handles all saving transaction-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface SavingTransaction {
  stId: number;
  sgId: number;
  monthId: number;
  memberId: number;
  memberName?: string;
  savingAmount: number;
  depositSavingAmount: number;
  paymentType: number; // 1: Cash, 2: Bank
  isPaid: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface UpdateSavingTransactionRequest {
  stId: number;
  paymentType: number;
  depositSavingAmount: number;
}

/**
 * Saving Transaction Service Class
 */
class SavingTransactionService {
  /**
   * Get saving pending by saving group ID
   */
  async getSavingPendingBySGID(sgId: number): Promise<APIResponse<SavingTransaction[]>> {
    try {
      return await apiService.get(`SavingTrasaction/SavingPending/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get saving pending by member ID
   */
  async getSavingPendingByMemberID(sgId: number, memberId: number): Promise<APIResponse<SavingTransaction[]>> {
    try {
      return await apiService.get(`SavingTrasaction/SavingPendingByMember/${sgId}/${memberId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update saving transaction
   */
  async updateSavingTransaction(data: UpdateSavingTransactionRequest[]): Promise<APIResponse> {
    try {
      return await apiService.put('SavingTrasaction/UpdateSavingTrasaction', data);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const savingTransactionService = new SavingTransactionService();

export default savingTransactionService;
