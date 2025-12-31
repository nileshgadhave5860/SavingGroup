using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
   public interface IIncomeExpensesRepository
    {
        Task<IncomeExpensesResponseDto> IncomeExpenseCreate(IncomeExpensesRequestDto request);
        Task<List<IncomeExpensesAccountDto>> GetIncomeExpensesBySGId(int SGId);
        Task<IncomeExpensesResponseDto> DeleteIncomeExpense(int IEId);
    }
}