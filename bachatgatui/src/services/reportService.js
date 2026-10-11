import apiService from './apiService';

/**
 * Report related API calls
 */
const reportService = {
  /**
   * Get saving pending report by saving group ID
   * @returns {Promise} List of saving pending report data
   */
  getSavingPendingReport: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/saving-pending/${sgId}`);
  },

  /**
   * Get loan pending report by saving group ID
   * @returns {Promise} List of loan pending report data
   */
  getLoanPendingReport: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/loan-pending/${sgId}`);
  },

  /**
   * Get interest pending report by saving group ID
   * @returns {Promise} List of interest pending report data
   */
  getIntrestPendingReport: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/intrest-pending/${sgId}`);
  },

  /**
   * Get late payment pending report by saving group ID
   * @returns {Promise} List of late payment pending report data
   */
  getLatePaymentPendingReport: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/late-payment-pending/${sgId}`);
  },

  /**
   * Get member report by saving group ID
   * @returns {Promise} List of member report data
   */
  getMemberReport: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/member-report/${sgId}`);
  },

  /**
   * Get month deposit report by saving group ID and month ID
   * @param {number} monthId - Month ID
   * @returns {Promise} List of month deposit report data
   */
  getMonthDepositReport: (monthId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/month-deposit/${sgId}/${monthId}`);
  },

  /**
   * Get month pending report by saving group ID and month ID
   * @param {number} monthId - Month ID
   * @returns {Promise} List of month pending report data
   */
  getMonthPendingReport: (monthId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/month-pending/${sgId}/${monthId}`);
  },

  /**
   * Get all months by saving group ID
   * @returns {Promise} List of months
   */
  getMonths: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/months/${sgId}`);
  },

  /**
   * Get all members by saving group ID
   * @returns {Promise} List of members
   */
  getMembers: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.savingGroupId || user.sgId;
    return apiService.get(`Report/members/${sgId}`);
  },
};

export default reportService;
