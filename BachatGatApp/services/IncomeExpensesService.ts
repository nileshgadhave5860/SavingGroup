/**
 * Income and Expenses Service
 * Handles all income and expenses-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface IncomeExpense {
  ieId: number;
  sgId: number;
  monthId: number;
  particulars: string;
  paymentType: number; // 1: Cash, 2: Bank
  incomeExpensesType: 0 | 1; // 0: Income, 1: Expense
  amount: number;
  createdDate: string;
  modifiedDate?: string;
}

export interface CreateIncomeExpenseRequest {
  sgId: number;
  monthId: number;
  particulars: string;
  paymentType: number;
  incomeExpensesType: 0 | 1;
  amount: number;
}

export interface UpdateIncomeExpenseRequest {
  ieId: number;
  particulars: string;
  amount: number;
  incomeExpensesType: 0 | 1;
}

/**
 * Income and Expenses Service Class
 */
class IncomeExpensesService {
  /**
   * Get all income and expenses by saving group ID
   */
  async getIncomeExpensesBySGID(sgId: number): Promise<APIResponse<IncomeExpense[]>> {
    try {
      return await apiService.get(`IncomeExpenses/GetBySGId/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get income expense by ID
   */
  async getIncomeExpenseById(ieId: number): Promise<APIResponse<IncomeExpense>> {
    try {
      return await apiService.get(`IncomeExpenses/${ieId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new income/expense entry
   */
  async createIncomeExpense(data: CreateIncomeExpenseRequest): Promise<APIResponse<IncomeExpense>> {
    try {
      return await apiService.post('IncomeExpenses/create', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update income/expense entry
   */
  async updateIncomeExpense(data: UpdateIncomeExpenseRequest): Promise<APIResponse<IncomeExpense>> {
    try {
      return await apiService.put('IncomeExpenses/Update', data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete income/expense entry
   */
  async deleteIncomeExpense(ieId: number): Promise<APIResponse> {
    try {
      return await apiService.delete(`IncomeExpenses/${ieId}`);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const incomeExpensesService = new IncomeExpensesService();

export default incomeExpensesService;
