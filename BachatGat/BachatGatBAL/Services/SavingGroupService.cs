using BachatGatDAL.Interfaces;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatBAL.Services
{
    public class SavingGroupService : ISavingGroupService
    {
        private readonly ISavingGroupRepository _repository;

        public SavingGroupService(ISavingGroupRepository repository)
        {
            _repository = repository;
        }

        public async Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request)
        {
            return await _repository.RegisterSavingGroup(request);
        }

        public async Task<SavingGroupLoginResponseDto> Authenticate(SavingGroupLoginDto request)
        {
            return await _repository.Authenticate(request);
        }

        public async Task<SavingGroupdashboardDto> GetSavingGroupDashboardData(int sgId)
        {
            return await _repository.GetSavingGroupDashboardData(sgId);
        }

        public Task<MemberDashboardDto> GetMemberDashboardData(int sgId, int memberId)
        {
            return _repository.GetMemberDashboardData(sgId, memberId);
        }
    }
}
