using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class SavingTrasactionService : ISavingTrasactionService
    {
        private readonly ISavingTrasactionRepository _repository;

        public SavingTrasactionService(ISavingTrasactionRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<SavingPendingDto>> SavingPending(int SGId)
        {
            return await _repository.SavingPending(SGId);
        }

        public async Task<List<SavingPendingByMemberDto>> SavingPendingByMember(int SGId, int MemberId)
        {
            return await _repository.SavingPendingByMember(SGId, MemberId);
        }

        public async Task<SavingTrasactionUpdateResposneDto> UpdateSavingTrasactionAsync(List<SavingTrasactionUpdateDto> requests)
        {
            return await _repository.UpdateSavingTrasactionAsync(requests);
        }
    }
}