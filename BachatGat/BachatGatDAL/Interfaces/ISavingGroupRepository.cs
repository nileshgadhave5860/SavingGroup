using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface ISavingGroupRepository
    {
        Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request);
        Task<SavingGroupLoginResponseDto> Authenticate(SavingGroupLoginDto request);
    }
}
