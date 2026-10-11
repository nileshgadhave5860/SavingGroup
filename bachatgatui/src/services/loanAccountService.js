import apiService from './apiService';

/**
 * Loan Account related API calls
 */
const loanAccountService = {
  /**
   * Get all loan accounts by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getLoanMembersBySGID: (sgId) => {
    return apiService.get(`LoansAccount/GetLoanMembers/${sgId}`);
  },

  /**
   * Get loans by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getLoansBySGID: (sgId) => {
    return apiService.get(`LoansAccount/${sgId}`);
  },

  /**
   * Create a new loan account
   * @param {object} loanData - Loan data
   */
  createLoan: (loanData) => {
    return apiService.post('LoansAccount/create', loanData);
  },

  /**
   * Update loan account
   * @param {object} loanData - Loan data
   */
  updateLoan: (loanData) => {
    return apiService.put('LoansAccount/update', loanData);
  },
};

export default loanAccountService;
