using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class MonthService : IMonthService
    {
        private readonly IMonthRepository _repository;

        public MonthService(IMonthRepository repository)
        {
            _repository = repository;
        }

        public async Task<CreateMonthResponseDto> CreateMonth(CreateMonthDto request)
        {
            return await _repository.CreateMonth(request);
        }

        public async Task<GetLastMonthResponseDto> GetLastMonth(int sgId)
        {
            return await _repository.GetLastMonth(sgId);
        }

        public async Task<GetMonthBySGIdResponseDto> GetMonthBySGId(int sgId)
        {
            return await _repository.GetMonthBySGId(sgId);
        }
    }
}
