import apiService from './apiService';

/**
 * Month related API calls
 */
const monthService = {
  /**
   * Get last month by saving group ID
   * @param {number} sgId - Saving Group ID
   */
  getMonthBySGID: (sgId) => {
    return apiService.get(`Month/GetMonthBySGId/${sgId}`);
  },

  /**
   * Create a new month
   * @param {object} monthData - Month data
   * @param {number} monthData.sgId - Saving Group ID
   * @param {number} monthData.newMonthNo - Month number (1-12)
   * @param {number} monthData.newYearNo - Year number
   */
  createMonth: (monthData) => {
    return apiService.post('Month/create', monthData);
  },

  getCurrentMonthIdBySGID: async (sgId) => {
    const data = await apiService.get(`Month/GetLastMonth/${sgId}`);
    const monthId = data?.monthId;
    if (monthId == null) {
      throw new Error(`monthId not found for sgId: ${sgId}`);
    }
    return monthId;
  }


};

export default monthService;
