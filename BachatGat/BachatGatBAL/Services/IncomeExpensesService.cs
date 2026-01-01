using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class IncomeExpensesService : IIncomeExpensesService
    {
        private readonly IIncomeExpensesRepository _repository;

        public IncomeExpensesService(IIncomeExpensesRepository repository)
        {
            _repository = repository;
        }

        public async Task<IncomeExpensesResponseDto> IncomeExpenseCreate(IncomeExpensesRequestDto request)
        {
            return await _repository.IncomeExpenseCreate(request);
        }

        public async Task<List<IncomeExpensesAccountDto>> GetIncomeExpensesBySGId(int SGId)
        {
            return await _repository.GetIncomeExpensesBySGId(SGId);
        }

        public async Task<IncomeExpensesResponseDto> DeleteIncomeExpense(int IEId)
        {
            return await _repository.DeleteIncomeExpense(IEId);
        }

        public async Task<IncomeExpensesResponseDto> UpdateIncomeExpense(UpdateIncomeExpensesDto request)
        {
            return await _repository.UpdateIncomeExpense(request);
        }
    }
}
