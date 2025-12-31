using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
 public interface   ILoansAccountRepository
    {
        Task<List<LoanAccountResponseDto>> GetLoanAccounts(int sgId);
        Task<List<LoanMemberDto>> GetLoanMembers(int sgId);
        Task<UpdateLoanResponseDto> CreateLoanAccount(LoansAccountRequestDto request);
        Task<UpdateLoanResponseDto> UpdateLoanAccount(LoansAccountRequestDto request);
    }

   
}