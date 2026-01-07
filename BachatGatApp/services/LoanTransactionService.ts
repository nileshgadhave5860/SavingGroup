/**
 * Loan Transaction Service
 * Handles all loan transaction-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface LoanTransaction {
  ltId: number;
  sgId: number;
  monthId: number;
  memberId: number;
  loanId: number;
  paymentType: number; // 1: Cash, 2: Bank
  repaidLoanAmount: number;
  createdDate: string;
  modifiedDate?: string;
}

export interface CreateLoanTransactionRequest {
  sgId: number;
  monthId: number;
  memberId: number;
  loanId: number;
  paymentType: number;
  repaidLoanAmount: number;
}

/**
 * Loan Transaction Service Class
 */
class LoanTransactionService {
  /**
   * Create a new loan transaction (repayment)
   */
  async createLoanTransaction(data: CreateLoanTransactionRequest): Promise<APIResponse<LoanTransaction>> {
    try {
      return await apiService.post('LoanTrasaction/create', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get loan transactions by loan ID
   */
  async getLoanTransactions(loanId: number): Promise<APIResponse<LoanTransaction[]>> {
    try {
      return await apiService.get(`LoanTrasaction/loan/${loanId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete loan transaction
   */
  async deleteLoanTransaction(ltId: number): Promise<APIResponse> {
    try {
      return await apiService.delete(`LoanTrasaction/${ltId}`);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const loanTransactionService = new LoanTransactionService();

export default loanTransactionService;
