using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface IMonthRepository
    {
        Task<CreateMonthResponseDto> CreateMonth(CreateMonthDto request);
        Task<GetLastMonthResponseDto> GetLastMonth(int sgId);
    }
}
