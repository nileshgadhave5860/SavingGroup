using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class BankService : IBankService
    {
        private readonly IBankRepository _repository;

        public BankService(IBankRepository repository)
        {
            _repository = repository;
        }

        public async Task<BankResponseDto> CashDeposit(BankRequestDto request)
        {
            return await _repository.CashDeposit(request);
        }

        public async Task<BankResponseDto> CashWithdraw(BankRequestDto request)
        {
            return await _repository.CashWithdraw(request);
        }
    }
}
