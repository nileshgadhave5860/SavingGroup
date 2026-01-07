/**
 * Loan Account Service
 * Handles all loan account-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface LoanAccount {
  loanId: number;
  sgId: number;
  memberId: number;
  memberName?: string;
  loanAmount: number;
  repaidLoanAmount: number;
  remainingLoanAmount: number;
  interestRate: number;
  loanDate: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface CreateLoanRequest {
  sgId: number;
  memberId: number;
  loanAmount: number;
  interestRate: number;
  loanDate: string;
}

export interface UpdateLoanRequest extends CreateLoanRequest {
  loanId: number;
}

export interface LoanMember {
  memberId: number;
  memberName: string;
  mobileNumber: string;
  totalLoanAmount: number;
  totalRepaidAmount: number;
  totalRemainingAmount: number;
}

/**
 * Loan Account Service Class
 */
class LoanAccountService {
  /**
   * Get all loan accounts by saving group ID
   */
  async getLoanMembersBySGID(sgId: number): Promise<APIResponse<LoanMember[]>> {
    try {
      return await apiService.get(`LoansAccount/GetLoanMembers/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get loans by saving group ID
   */
  async getLoansBySGID(sgId: number): Promise<APIResponse<LoanAccount[]>> {
    try {
      return await apiService.get(`LoansAccount/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new loan account
   */
  async createLoan(loanData: CreateLoanRequest): Promise<APIResponse<LoanAccount>> {
    try {
      return await apiService.post('LoansAccount/create', loanData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update loan account
   */
  async updateLoan(loanData: UpdateLoanRequest): Promise<APIResponse<LoanAccount>> {
    try {
      return await apiService.put('LoansAccount/update', loanData);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const loanAccountService = new LoanAccountService();

export default loanAccountService;
