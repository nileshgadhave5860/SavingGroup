using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface ILoanTrasactionService
    {
        Task<LoanTrasactionResponseDto> CreateLoanTrasaction(CreateLoanTrasactionDto request);
        Task<LoanTrasactionResponseDto> UpdateLoanTrasaction(UpdateLoanTrasactionDto request);
        Task<DeleteLoanTrasactionResponseDto> DeleteLoanTrasaction(int ltId);
        Task<GetLoanTrasactionByLoanIdResponseDto> GetLoanTrasactionByLoanId(int loanId);
    }
}
