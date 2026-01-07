/**
 * Late Payment Charges Service
 * Handles all late payment charges-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface LatePaymentCharge {
  lpcId: number;
  sgId: number;
  monthId: number;
  memberId: number;
  memberName?: string;
  chargeAmount: number;
  depositAmount: number;
  isPaid: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface DepositLatePaymentChargeRequest {
  lpcId: number;
  depositAmount: number;
}

/**
 * Late Payment Charges Service Class
 */
class LatePaymentChargesService {
  /**
   * Get late payment pending charges by saving group ID
   */
  async getLatPaymentPendingChargesBySGID(sgId: number): Promise<APIResponse<LatePaymentCharge[]>> {
    try {
      return await apiService.get(`LatePaymentCharges/pending/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete late payment charge
   */
  async deleteLatePaymentCharge(lpcId: number): Promise<APIResponse> {
    try {
      return await apiService.delete(`LatePaymentCharges/delete/${lpcId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update late payment charge deposit
   */
  async depositLatePaymentCharge(depositData: DepositLatePaymentChargeRequest): Promise<APIResponse> {
    try {
      return await apiService.put('LatePaymentCharges/update', depositData);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const latePaymentChargesService = new LatePaymentChargesService();

export default latePaymentChargesService;
