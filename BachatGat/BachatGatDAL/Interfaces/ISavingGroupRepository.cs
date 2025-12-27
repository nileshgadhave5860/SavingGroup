using BachatGatDAL.Entities;
using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface ISavingGroupRepository
    {
        Task<List<SavingGroupAccount>> GetAllSavingGroups();
        Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request);
        Task<SavingGroupLoginResponseDto> Authenticate(SavingGroupLoginDto request);
    }
}
