import apiService from './apiService';

/**
 * Member related API calls
 */
const memberService = {
  /**
   * Get all members by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getMembersBySGID: (sgId) => {
    return apiService.get(`Member/GetMemberDataBySGID/${sgId}`);
  },

GetMemberPendingDataBySGId: (sgId) => {
    return apiService.get(`Member/GetMemberPendingDataBySGId/${sgId}`);
  },
  
  /**
   * Get member by ID
   * @param {number} memberId - Member ID
   */
  getMemberById: (memberId) => {
    return apiService.get(`Member/${memberId}`);
  },

  /**
   * Create a new member
   * @param {object} memberData - Member data
   */
  createMember: (memberData) => {
    return apiService.post('Member/create', memberData);
  },

  /**
   * Update member
   * @param {object} memberData - Member data
   */
  updateMember: (memberData) => {
    return apiService.put('Member/update', memberData);
  },

  /**
   * Delete member
   * @param {number} memberId - Member ID
   */
  deleteMember: (memberId) => {
    return apiService.delete(`Member/${memberId}`);
  },

  /**
   * Toggle member active status
   * @param {number} memberId - Member ID
   * @param {string} action - 'activate' or 'deactivate'
   */
  toggleMemberStatus: (memberId, action) => {
    return apiService.put(`Member/${memberId}/${action}`);
  },
};

export default memberService;
