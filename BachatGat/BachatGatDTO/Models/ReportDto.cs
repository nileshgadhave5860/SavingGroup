namespace BachatGatDTO.Models
{
    public class SavingPendingReportDto
    {
        public string MemberName { get; set; } = null!;
        public string PendingMonths{ get; set; } = null!;
        public decimal? SavingPending { get; set; }
    }
    public class LoanPendingReportDto
    {
        public string MemberName { get; set; } = null!;
       public decimal? LoanAmount { get; set; }
        public decimal? RepaymentAmount { get; set; }
         public decimal? PendingLoanAmount { get; set; }

    }
    public class IntrestPendingReportDto
    {
        public string MemberName { get; set; } = null!;
         public string PendingMonths{ get; set; } = null!;
        public decimal? IntrestPending { get; set; }
    }
    public class LatePaymetPendingReportDto
    {
        public string MemberName { get; set; } = null!;
         public string PendingMonths{ get; set; } = null!;
        public decimal? LatePaymentPending { get; set; }
    }
    public class MemberReportDto
    {
        public string MemberName { get; set; } = null!;
        public decimal? TotalSaving { get; set; }
        public decimal? PendingLoan { get; set; }
        public decimal? PendingIntrest { get; set; }
         public decimal? PendingLatePayment { get; set; }
    }
    public class MonthDepositReportDto
    {
        public string MemberName { get; set; } = null!;
        public decimal? SavingDeposit { get; set; }
        public decimal? LoanDeposit { get; set; }
        public decimal? IntrestDeposit { get; set; }
        public decimal? LatePaymentDeposit { get; set; }
    }

    public class MonthPendingReportDto
    {
        public string MemberName { get; set; } = null!;
        public decimal? SavingPending { get; set; }
        public decimal? LoanPending { get; set; }
        public decimal? IntrestPending { get; set; }
        public decimal? LatePaymentPending { get; set; }
    }
    public class MonthDataDto
    {
        public int MonthId { get; set; }
        public string MonthName { get; set; } = null!;
    }
    public class MemberDataDto
    {
        public int MemberId { get; set; }
        public string? MemberName { get; set; }
        
    }

}