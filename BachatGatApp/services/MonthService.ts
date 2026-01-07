/**
 * Month Service
 * Handles all month-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface Month {
  monthId: number;
  sgId: number;
  monthNo: number; // 1-12
  yearNo: number;
  monthName?: string;
  createdDate: string;
}

export interface CreateMonthRequest {
  sgId: number;
  newMonthNo: number; // 1-12
  newYearNo: number;
}

/**
 * Month Service Class
 */
class MonthService {
  /**
   * Get last month by saving group ID
   */
  async getMonthBySGID(sgId: number): Promise<APIResponse<Month>> {
    try {
      return await apiService.get(`Month/GetMonthBySGId/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new month
   */
  async createMonth(monthData: CreateMonthRequest): Promise<APIResponse<Month>> {
    try {
      return await apiService.post('Month/create', monthData);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const monthService = new MonthService();

export default monthService;
