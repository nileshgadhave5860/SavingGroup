using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface ISavingTrasactionRepository
    {
       Task<List<SavingPendingDto>> SavingPending(int SGId);
       Task<List<SavingPendingByMemberDto>> SavingPendingByMember(int SGId,int MemberId);
      Task<SavingTrasactionUpdateResposneDto> UpdateSavingTrasactionAsync(List<SavingTrasactionUpdateDto> requests);
    }
}
