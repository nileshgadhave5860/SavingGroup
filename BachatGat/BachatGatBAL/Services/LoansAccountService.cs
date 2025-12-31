using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class LoansAccountService : ILoansAccountService
    {
        private readonly ILoansAccountRepository _repository;

        public LoansAccountService(ILoansAccountRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<LoanAccountResponseDto>> GetLoanAccounts(int sgId)
        {
            return await _repository.GetLoanAccounts(sgId);
        }

        public async Task<List<LoanMemberDto>> GetLoanMembers(int sgId)
        {
            return await _repository.GetLoanMembers(sgId);
        }

        public async Task<UpdateLoanResponseDto> CreateLoanAccount(LoansAccountRequestDto request)
        {
            return await _repository.CreateLoanAccount(request);
        }

        public async Task<UpdateLoanResponseDto> UpdateLoanAccount(LoansAccountRequestDto request)
        {
            return await _repository.UpdateLoanAccount(request);
        }
    }
}
