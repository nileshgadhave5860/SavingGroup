using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface ISavingTrasactionService
    {
       Task<List<SavingPendingDto>> SavingPending(int SGId);
       Task<List<SavingPendingByMemberDto>> SavingPendingByMember(int SGId,int MemberId);
     Task<SavingTrasactionUpdateResposneDto> UpdateSavingTrasactionAsync(List<SavingTrasactionUpdateDto> requests);
    }
}
