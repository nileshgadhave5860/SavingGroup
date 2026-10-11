import apiService from './apiService';

/**
 * Loan Transaction related API calls
 */
const loanTransactionService = {
  /**
   * Create a new loan transaction (repayment)
   * @param {object} data - Loan transaction data
   * @param {number} data.sgId - Saving Group ID
   * @param {number} data.monthId - Month ID
   * @param {number} data.memberId - Member ID
   * @param {number} data.loanId - Loan ID
   * @param {number} data.paymentType - Payment Type (1: Cash, 2: Bank)
   * @param {number} data.repaidLoanAmount - Repaid Loan Amount
   */
  createLoanTransaction: (data) => {
    return apiService.post('LoanTrasaction/create', data);
  },

  /**
   * Get loan transactions by loan ID
   * @param {number} loanId - Loan ID
   */
  getLoanTransactions: (loanId) => {
    return apiService.get(`LoanTrasaction/loan/${loanId}`);
  },

  /**
   * Delete loan transaction
   * @param {number} ltId - Loan Transaction ID
   */
  deleteLoanTransaction: (ltId) => {
    return apiService.delete(`LoanTrasaction/${ltId}`);
  },
};

export default loanTransactionService;
