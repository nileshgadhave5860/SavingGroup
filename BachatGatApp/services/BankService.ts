/**
 * Bank Service
 * Handles all bank-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface BankTransaction {
  bankId: number;
  sgId: number;
  monthId: number;
  transactionType: 'deposit' | 'withdraw';
  amount: number;
  createdDate: string;
}

export interface BankDepositRequest {
  sgId: number;
  monthId: number;
  amount: number;
}

export interface BankWithdrawRequest {
  sgId: number;
  monthId: number;
  amount: number;
}

/**
 * Bank Service Class
 */
class BankService {
  /**
   * Deposit money to bank account
   */
  async bankDeposit(data: BankDepositRequest): Promise<APIResponse<BankTransaction>> {
    try {
      return await apiService.post('Bank/Deposit', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Withdraw money from bank account
   */
  async bankWithdraw(data: BankWithdrawRequest): Promise<APIResponse<BankTransaction>> {
    try {
      return await apiService.post('Bank/Withdraw', data);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const bankService = new BankService();

export default bankService;
