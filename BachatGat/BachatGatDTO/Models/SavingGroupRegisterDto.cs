namespace BachatGatDTO.Models
{
    public class SavingGroupRegisterDto
    {
        public string SGName { get; set; } = null!;
        public string SGAddress { get; set; } = null!;
        public string SGMobileNo { get; set; } = null!;
        public string SGEmailId { get; set; } = null!;
        public string SGPassword { get; set; } = null!;
        public int MonthStartDate { get; set; }
        public int MonthEndDate { get; set; }
        public decimal MonthlySavingAmount { get; set; }
        public decimal InterestEarned { get; set; }
        public decimal LatePaymentCharges_PerDay { get; set; }
        public int MonthNo { get; set; }
        public int YearNo { get; set; }
    }

    public class SavingGroupResponseDto
    {
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public string SGName { get; set; } = null!;
        public string Message { get; set; } = null!;
    }

    public class SavingGroupLoginDto
    {
        public string SGMobileNo { get; set; } = null!;
        public string SGPassword { get; set; } = null!;
    }

    public class SavingGroupLoginResponseDto
    {
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int? MemberId { get; set; }
        public string SGName { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public string Token { get; set; } = null!;
    }

    public class AuthResponseDto
    {
        public int? SGId { get; set; }
        public int? MonthId { get; set; }
        public int? MemberId { get; set; }
        public string Name { get; set; } = null!;
        public string Role { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public string Token { get; set; } = null!;
    }

    public class AuthRequestDto
    {
        public bool IsMemberLogin { get; set; }        
        public int? SGId { get; set; }
        public string MobileNo { get; set; } = null!;
        public string Password { get; set; } = null!;

        
    }
    public class dashboardDto
    {
        public int TotalMembers { get; set; }
        public decimal TotalSavings { get; set; }
        public decimal TotalLoans { get; set; }
        public decimal TotalInterestEarned { get; set; }
        public decimal CashBalance { get; set; }
        public decimal BankBalance { get; set; }
        public decimal TotalLateFeesCollected { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalIncome { get; set; }




    }
}
