using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface IIntrestTrasactionSerivce
    {
       Task<List<IntrestPendingDto>> IntrestPending(int SGId);
       Task<List<IntrestPendingByMemberDto>> IntrestPendingByMember(int SGId,int MemberId);
       Task<IntrestTrasactionResponseDto> UpdateIntrestTrasaction(List<IntrestTrasactionUpdateDto> requests);
    }
}
