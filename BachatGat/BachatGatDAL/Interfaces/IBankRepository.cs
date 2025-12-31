using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
public interface IBankRepository
    {
       Task<BankResponseDto> CashDeposit(BankRequestDto request);
        Task<BankResponseDto> CashWithdraw(BankRequestDto request);
       
    }
}