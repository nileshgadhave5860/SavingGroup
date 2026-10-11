import apiService from './apiService';

/**
 * Income and Expenses related API calls
 */
const incomeExpensesService = {
  /**
   * Get all income and expenses by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getIncomeExpensesBySGID: (sgId) => {
    return apiService.get(`IncomeExpenses/GetBySGId/${sgId}`);
  },

  /**
   * Get income expense by ID
   * @param {number} ieId - Income Expense ID
   */
  getIncomeExpenseById: (ieId) => {
    return apiService.get(`IncomeExpenses/${ieId}`);
  },

  /**
   * Create a new income/expense entry
   * @param {object} data - Income/Expense data
   * @param {number} data.sgId - Saving Group ID
   * @param {number} data.monthId - Month ID
   * @param {string} data.particulars - Particulars/Description
   * @param {number} data.paymentType - Payment type
   * @param {number} data.incomeExpensesType - Type (0=Income, 1=Expense)
   * @param {number} data.amount - Amount
   */
  createIncomeExpense: (data) => {
    return apiService.post('IncomeExpenses/create', data);
  },

  /**
   * Update income/expense entry
   * @param {object} data - Income/Expense data
   * @param {number} data.ieId - Income Expense ID
   * @param {string} data.particulars - Particulars/Description
   * @param {number} data.amount - Amount
   * @param {number} data.incomeExpensesType - Type (0=Income, 1=Expense)
   */
  updateIncomeExpense: (data) => {
    return apiService.put('IncomeExpenses/Update', data);
  },

  /**
   * Delete income/expense entry
   * @param {number} ieId - Income Expense ID
   */
  deleteIncomeExpense: (ieId) => {
    return apiService.delete(`IncomeExpenses/${ieId}`);
  },
};

export default incomeExpensesService;
