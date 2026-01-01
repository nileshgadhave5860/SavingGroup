using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class LatePaymentChargesService : ILatePaymentChargesService
    {
        private readonly ILatePaymentChargesRepository _repository;

        public LatePaymentChargesService(ILatePaymentChargesRepository repository)
        {
            _repository = repository;
        }

        public async Task<LatePaymentChargesReposnseDto> AutoCalculateLatePaymentCharges(int sgId)
        {
            return await _repository.AutoCalculateLatePaymentCharges(sgId);
        }

        public async Task<List<LatePaymentChargesAccountDto>> GetPendingLatePaymentCharges(int sgId)
        {
            return await _repository.GetPendingLatePaymentCharges(sgId);
        }

        public async Task<LatePaymentChargesReposnseDto> DeleteLatePaymentCharge(int lpcId)
        {
            return await _repository.DeleteLatePaymentCharge(lpcId);
        }

        public async Task<LatePaymentChargesReposnseDto> UpdateLatePaymentCharge(int lpcId, decimal depositAmount)
        {
            return await _repository.UpdateLatePaymentCharge(lpcId, depositAmount);
        }
    }
}
