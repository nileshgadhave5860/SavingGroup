using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface ILatePaymentChargesService
    {
        Task<LatePaymentChargesReposnseDto> AutoCalculateLatePaymentCharges(int sgId);
        Task<List<LatePaymentChargesAccountDto>> GetPendingLatePaymentCharges(int sgId);
        Task<LatePaymentChargesReposnseDto> DeleteLatePaymentCharge(int lpcId);
        Task<LatePaymentChargesReposnseDto> UpdateLatePaymentCharge(int lpcId, decimal depositAmount);
    }
}
