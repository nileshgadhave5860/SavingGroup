import apiService from './apiService';

/**
 * Saving Transaction related API calls
 */
const savingTransactionService = {
  /**
   * Get saving pending by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getSavingPendingBySGID: (sgId) => {
    return apiService.get(`SavingTrasaction/SavingPending/${sgId}`);
  },
  getSavingPendingByMemberID: (sgId,memberId) => {
    return apiService.get(`SavingTrasaction/SavingPendingByMember/${sgId}/${memberId}`);
  },
  /**
   * Update saving transaction
   * @param {Array} data - Array of objects with stId, paymentType, and depositSavingAmount
   */
  UpdateSavingTrasaction: (data) => {
    return apiService.put(`SavingTrasaction/UpdateSavingTrasaction`, data);
  },
  PendingDeposit: (data) => {
    return apiService.post(`SavingTrasaction/PendingDeposit`, data);
  }
 
  
};

export default savingTransactionService;
