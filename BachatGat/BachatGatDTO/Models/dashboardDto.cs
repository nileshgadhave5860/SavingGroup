namespace BachatGatDTO.Models
{
    public class SavingGroupdashboardDto
    {
        public int SGId { get; set; }
        public string SGName { get; set; } = null!;
        public int TotalMembers { get; set; }
         public decimal SavingsBalance { get; set; }
        public decimal TotalSavings { get; set; }
        public decimal TotalLoans { get; set; }
        public decimal TotalInterestEarned { get; set; }
        public decimal CashBalance { get; set; }
        public decimal BankBalance { get; set; }
        public decimal TotalLateFeesCollected { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalIncome { get; set; }        
        public int SavingPendingMembersCount { get; set; }
        public decimal SavingPendingAmount { get; set; }
        public int IntrestPendingMembersCount { get; set; }
        public decimal IntrestPendingAmount { get; set; }

         public int LateFeesPendingMembersCount { get; set; }
        public decimal LateFeesPendingAmount { get; set; }
    }

    public class MemberDashboardDto
    {
             

        //Member Pending Details
        public int MemberId { get; set; }
        public string FullName { get; set; } = null!;
        public int SavingPendingMonthsCount { get; set; }
        public decimal SavingPendingAmount { get; set; }
        public int IntrestPendingMonthsCount { get; set; }
        public decimal IntrestPendingAmount { get; set; }
        public decimal LateFeesPendingAmount { get; set; }

        public decimal TotalSavings { get; set; }
        public decimal TotalLoan { get; set; }

         //Saving Details
        public SavingGroupdashboardDto SavingGroupDetails { get; set; } = null!;

    }
}