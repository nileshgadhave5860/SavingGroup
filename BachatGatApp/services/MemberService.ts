/**
 * Member Service
 * Handles all member-related API calls
 */

import apiService, { APIResponse } from './APIService';

// Types
export interface Member {
  memberId: number;
  sgId: number;
  memberName: string;
  mobileNumber: string;
  address?: string;
  isActive: boolean;
  joinDate: string;
  createdDate: string;
  modifiedDate?: string;
}

export interface CreateMemberRequest {
  sgId: number;
  memberName: string;
  mobileNumber: string;
  address?: string;
}

export interface UpdateMemberRequest extends CreateMemberRequest {
  memberId: number;
}

/**
 * Member Service Class
 */
class MemberService {
  /**
   * Get all members by saving group ID
   */
  async getMembersBySGID(sgId: number): Promise<APIResponse<Member[]>> {
    try {
      return await apiService.get(`Member/GetMemberDataBySGID/${sgId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get member by ID
   */
  async getMemberById(memberId: number): Promise<APIResponse<Member>> {
    try {
      return await apiService.get(`Member/${memberId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new member
   */
  async createMember(memberData: CreateMemberRequest): Promise<APIResponse<Member>> {
    try {
      return await apiService.post('Member/create', memberData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update member
   */
  async updateMember(memberData: UpdateMemberRequest): Promise<APIResponse<Member>> {
    try {
      return await apiService.put('Member/update', memberData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete member
   */
  async deleteMember(memberId: number): Promise<APIResponse> {
    try {
      return await apiService.delete(`Member/${memberId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle member active status
   */
  async toggleMemberStatus(memberId: number, action: 'activate' | 'deactivate'): Promise<APIResponse> {
    try {
      return await apiService.put(`Member/${memberId}/${action}`);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const memberService = new MemberService();

export default memberService;
