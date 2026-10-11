import apiService from './apiService';

/**
 * Late Payment Charges related API calls
 */
const latePaymentChargesService = {
  /**
   * Get late payment pending charges by saving group ID
   * @param {number} sgId - Saving Group ID
   * @returns {Promise} - Promise with late payment pending charges data
   * @param {number} memberId - memberId ID
   */
  getLatPaymentPendingChargesBySGID: (sgId) => {
    return apiService.get(`LatePaymentCharges/pending/${sgId}`);
  },


   getPendingLatePaymentChargesByMember: (sgId,memberId) => {
    return apiService.get(`LatePaymentCharges/pending-by-member/${sgId}/${memberId}`);
  },

  /**
   * Delete late payment charge
   * @param {number} lpcId - Late Payment Charge ID
   * @returns {Promise} - Promise with delete response
   */
  deleteLatePaymentCharge: (lpcId) => {
    return apiService.delete(`LatePaymentCharges/delete/${lpcId}`);
  },

  /**
   * Update late payment charge deposit
   * @param {object} depositData - Deposit data with lpcId and depositAmount
   * @returns {Promise} - Promise with update response
   */
  depositLatePaymentCharge: (depositData) => {
    return apiService.put('LatePaymentCharges/update', depositData);
  },

};

export default latePaymentChargesService;
