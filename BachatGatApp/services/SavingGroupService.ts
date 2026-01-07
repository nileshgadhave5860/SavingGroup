/**
 * Saving Group Service
 * Handles all saving group-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface SavingGroup {
  sgId: number;
  groupName: string;
  description?: string;
  memberCount: number;
  totalSavings: number;
  totalCash: number;
  totalBank: number;
  createdDate: string;
  modifiedDate?: string;
}

export interface DashboardData {
  savingGroup: SavingGroup;
  totalMembers: number;
  activeMembers: number;
  totalLoans: number;
  totalSavings: number;
  totalCash: number;
  totalBank: number;
  currentMonth: {
    monthId: number;
    monthNo: number;
    yearNo: number;
  };
}

export interface MemberDashboardData {
  member: {
    memberId: number;
    memberName: string;
    mobileNumber: string;
  };
  totalSavings: number;
  totalLoans: number;
  pendingLoans: number;
  totalInterest: number;
}

export interface CreateGroupRequest {
  groupName: string;
  description?: string;
  savingAmount?: number;
  interestRate?: number;
}

/**
 * Saving Group Service Class
 */
class SavingGroupService {
  /**
   * Get dashboard data for a saving group
   */
  async getDashboardData(sgId: number): Promise<APIResponse<DashboardData>> {
    try {
      return await apiService.get(`SavingGroup/GetSavingGroupDashboardData/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get member dashboard data
   */
  async getMemberDashboardData(sgId: number, memberId: number): Promise<APIResponse<MemberDashboardData>> {
    try {
      return await apiService.get(`SavingGroup/GetMemberDashboardData/${sgId}/${memberId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get saving group details by ID
   */
  async getGroupById(sgId: number): Promise<APIResponse<SavingGroup>> {
    try {
      return await apiService.get(`SSavingGroup/create', groupData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update saving group
   */
  async updateGroup(groupData: Partial<CreateGroupRequest>): Promise<APIResponse<SavingGroup>> {
    try {
      return await apiService.put('SavingGroup/update', groupData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete saving group
   */
  async deleteGroup(sgId: number): Promise<APIResponse> {
    try {
      return await apiService.delete(`SavingGroup/${sgId}bers/${memberId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Join group by ID
   */
  async joinGroup(groupId: string): Promise<APIResponse> {
    try {
      return await apiService.post(`/saving-groups/${groupId}/join`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId: string): Promise<APIResponse> {
    try {
      return await apiService.post(`/saving-groups/${groupId}/leave`);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const savingGroupService = new SavingGroupService();

export default savingGroupService;
