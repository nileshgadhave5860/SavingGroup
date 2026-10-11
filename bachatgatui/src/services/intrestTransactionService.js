import apiService from './apiService';

/**
 * Interest Transaction related API calls
 */
const intrestTransactionService = {
  /**
   * Get interest pending by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getIntrestPendingBySGID: (sgId) => {
    return apiService.get(`IntrestTrasaction/IntrestPending/${sgId}`);
  },

  /**
   * Get interest pending by member ID
   * @param {number} sgId - Saving Group ID
   * @param {number} memberId - Member ID
   */
  getIntrestPendingByMemberID: (sgId, memberId) => {
    return apiService.get(`IntrestTrasaction/IntrestPendingByMember/${sgId}/${memberId}`);
  },

  /**
   * Update interest transaction
   * @param {Array} data - Array of objects with itId, paymentType, and depositIntrestAmount
   */
  UpdateIntrestTrasaction: (data) => {
    return apiService.put(`IntrestTrasaction/UpdateIntrestTrasaction`, data);
  }
};

export default intrestTransactionService;
