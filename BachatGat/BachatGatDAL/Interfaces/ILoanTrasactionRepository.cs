using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface ILoanTrasactionRepository
    {
        Task<LoanTrasactionResponseDto> CreateLoanTrasaction(CreateLoanTrasactionDto request);
        Task<LoanTrasactionResponseDto> UpdateLoanTrasaction(UpdateLoanTrasactionDto request);
        Task<DeleteLoanTrasactionResponseDto> DeleteLoanTrasaction(int ltId);
        Task<GetLoanTrasactionByLoanIdResponseDto> GetLoanTrasactionByLoanId(int loanId);
    }
}
