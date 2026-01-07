using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface IReportService
    {
        Task<List<SavingPendingReportDto>> GetSavingPendingReport(int sgId);
        Task<List<LoanPendingReportDto>> GetLoanPendingReport(int sgId);
        Task<List<IntrestPendingReportDto>> GetIntrestPendingReport(int sgId);
        Task<List<LatePaymetPendingReportDto>> GetLatePaymentPendingReport(int sgId);
        Task<List<MemberReportDto>> GetMemberReport(int sgId);
        Task<List<MonthDepositReportDto>> GetMonthDepositReport(int sgId, int monthId);
        Task<List<MonthPendingReportDto>> GetMonthPendingReport(int sgId, int monthId);
        Task<List<MonthDto>> GetMonths(int SgId);
        Task<List<MemberDataDto>> GetMembers(int SgId);
    }
}
