import apiService from './apiService';

/**
 * Bank related API calls
 */
const bankService = {
  /**
   * Deposit money to bank account
   * @param {object} data - Deposit data
   * @param {number} data.sgId - Saving Group ID
   * @param {number} data.monthId - Month ID
   * @param {number} data.amount - Amount to deposit
   */
  bankDeposit: (data) => {
    return apiService.post('Bank/Deposit', data);
  },

  /**
   * Withdraw money from bank account
   * @param {object} data - Withdraw data
   * @param {number} data.sgId - Saving Group ID
   * @param {number} data.monthId - Month ID
   * @param {number} data.amount - Amount to withdraw
   */
  bankWithdraw: (data) => {
    return apiService.post('Bank/Withdraw', data);
  },
};

export default bankService;
