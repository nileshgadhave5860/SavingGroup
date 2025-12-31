using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class IntrestTrasactionSerivce : IIntrestTrasactionSerivce
    {
        private readonly IIntrestTrasactionRepository _repository;

        public IntrestTrasactionSerivce(IIntrestTrasactionRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<IntrestPendingDto>> IntrestPending(int SGId)
        {
            return await _repository.IntrestPending(SGId);
        }

        public async Task<List<IntrestPendingByMemberDto>> IntrestPendingByMember(int SGId, int MemberId)
        {
            return await _repository.IntrestPendingByMember(SGId, MemberId);
        }

        public async Task<IntrestTrasactionResponseDto> UpdateIntrestTrasaction(List<IntrestTrasactionUpdateDto> requests)
        {
            return await _repository.UpdateIntrestTrasaction(requests);
        }
    }
}