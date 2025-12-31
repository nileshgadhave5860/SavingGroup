using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface ISavingGroupService
    {
        Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request);
        Task<SavingGroupLoginResponseDto> Authenticate(SavingGroupLoginDto request);
         Task<SavingGroupdashboardDto> GetSavingGroupDashboardData(int sgId);
        Task<MemberDashboardDto> GetMemberDashboardData(int sgId, int memberId);
    }
}
