using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface ILoansAccountService
    {
        Task<List<LoanAccountResponseDto>> GetLoanAccounts(int sgId);
        Task<List<LoanMemberDto>> GetLoanMembers(int sgId);
        Task<UpdateLoanResponseDto> CreateLoanAccount(LoansAccountRequestDto request);
        Task<UpdateLoanResponseDto> UpdateLoanAccount(LoansAccountRequestDto request);
    }
}
