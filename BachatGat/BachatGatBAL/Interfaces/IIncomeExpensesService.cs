using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface IIncomeExpensesService
    {
        Task<IncomeExpensesResponseDto> IncomeExpenseCreate(IncomeExpensesRequestDto request);
        Task<List<IncomeExpensesAccountDto>> GetIncomeExpensesBySGId(int SGId);
        Task<IncomeExpensesResponseDto> DeleteIncomeExpense(int IEId);
        Task<IncomeExpensesResponseDto> UpdateIncomeExpense(UpdateIncomeExpensesDto request);
    }
}
