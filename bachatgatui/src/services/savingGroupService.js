import apiService from './apiService';

/**
 * Saving Group related API calls
 */
const savingGroupService = {
  /**
   * Get dashboard data for a saving group
   * @param {number} sgId - Saving Group ID
   */
  getDashboardData: (sgId) => {
    return apiService.get(`SavingGroup/GetSavingGroupDashboardData/${sgId}`);
  },

  /**
   * Get member dashboard data
   * @param {number} sgId - Saving Group ID
   * @param {number} memberId - Member ID
   */
  getMemberDashboardData: (sgId, memberId) => {
    return apiService.get(`SavingGroup/GetMemberDashboardData/${sgId}/${memberId}`);
  },

  /**
   * Get saving group details by ID
   * @param {number} sgId - Saving Group ID
   */
  getGroupById: (sgId) => {
    return apiService.get(`SavingGroup/${sgId}`);
  },

  /**
   * Get all saving groups
   */
  getAllGroups: () => {
    return apiService.get('SavingGroup');
  },

  /**
   * Create a new saving group
   * @param {object} groupData - Group data
   */
  createGroup: (groupData) => {
    return apiService.post('SavingGroup/create', groupData);
  },

  /**
   * Update saving group
   * @param {object} groupData - Group data
   */
  updateGroup: (groupData) => {
    return apiService.put('SavingGroup/update', groupData);
  },

  /**
   * Delete saving group
   * @param {number} sgId - Saving Group ID
   */
  deleteGroup: (sgId) => {
    return apiService.delete(`SavingGroup/${sgId}`);
  },
};

export default savingGroupService;
