using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface IBankService
    {
        Task<BankResponseDto> CashDeposit(BankRequestDto request);
        Task<BankResponseDto> CashWithdraw(BankRequestDto request);
    }
}
