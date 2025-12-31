using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface IIntrestTrasactionRepository
    {
       Task<List<IntrestPendingDto>> IntrestPending(int SGId);
       Task<List<IntrestPendingByMemberDto>> IntrestPendingByMember(int SGId,int MemberId);
       Task<IntrestTrasactionResponseDto> UpdateIntrestTrasaction(List<IntrestTrasactionUpdateDto> requests);
    }
}
