using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;

        public ReportService(IReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<SavingPendingReportDto>> GetSavingPendingReport(int sgId)
        {
            return await _repository.GetSavingPendingReport(sgId);
        }

        public async Task<List<LoanPendingReportDto>> GetLoanPendingReport(int sgId)
        {
            return await _repository.GetLoanPendingReport(sgId);
        }

        public async Task<List<IntrestPendingReportDto>> GetIntrestPendingReport(int sgId)
        {
            return await _repository.GetIntrestPendingReport(sgId);
        }

        public async Task<List<LatePaymetPendingReportDto>> GetLatePaymentPendingReport(int sgId)
        {
            return await _repository.GetLatePaymentPendingReport(sgId);
        }

        public async Task<List<MemberReportDto>> GetMemberReport(int sgId)
        {
            return await _repository.GetMemberReport(sgId);
        }

        public async Task<List<MonthDepositReportDto>> GetMonthDepositReport(int sgId, int monthId)
        {
            return await _repository.GetMonthDepositReport(sgId, monthId);
        }

        public async Task<List<MonthPendingReportDto>> GetMonthPendingReport(int sgId, int monthId)
        {
            return await _repository.GetMonthPendingReport(sgId, monthId);
        }

        public async Task<List<MonthDto>> GetMonths(int SgId)
        {
            return await _repository.GetMonths(SgId);
        }

        public async Task<List<MemberDataDto>> GetMembers(int SgId)
        {
            return await _repository.GetMembers(SgId);
        }
    }
}
