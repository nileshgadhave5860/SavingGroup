using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class LoanTrasactionService : ILoanTrasactionService
    {
        private readonly ILoanTrasactionRepository _repository;

        public LoanTrasactionService(ILoanTrasactionRepository repository)
        {
            _repository = repository;
        }

        public async Task<LoanTrasactionResponseDto> CreateLoanTrasaction(CreateLoanTrasactionDto request)
        {
            return await _repository.CreateLoanTrasaction(request);
        }

        public async Task<LoanTrasactionResponseDto> UpdateLoanTrasaction(UpdateLoanTrasactionDto request)
        {
            return await _repository.UpdateLoanTrasaction(request);
        }

        public async Task<DeleteLoanTrasactionResponseDto> DeleteLoanTrasaction(int ltId)
        {
            return await _repository.DeleteLoanTrasaction(ltId);
        }

        public async Task<GetLoanTrasactionByLoanIdResponseDto> GetLoanTrasactionByLoanId(int loanId)
        {
            return await _repository.GetLoanTrasactionByLoanId(loanId);
        }
    }
}
