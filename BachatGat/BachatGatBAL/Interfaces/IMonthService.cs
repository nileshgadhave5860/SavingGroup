using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface IMonthService
    {
        Task<CreateMonthResponseDto> CreateMonth(CreateMonthDto request);
        Task<GetLastMonthResponseDto> GetLastMonth(int sgId);
        Task<GetMonthBySGIdResponseDto> GetMonthBySGId(int sgId);
    }
}
