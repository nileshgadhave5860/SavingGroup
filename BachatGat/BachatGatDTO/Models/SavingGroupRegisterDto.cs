namespace BachatGatDTO.Models
{
    public class SavingGroupRegisterDto
    {
        public string SGName { get; set; }
        public string SGAddress { get; set; }
        public string SGMobileNo { get; set; }
        public string SGEmailId { get; set; }
        public string SGPassword { get; set; }
        public int MonthStartDate { get; set; }
        public int MonthEndDate { get; set; }
        public decimal MonthlySavingAmount { get; set; }
        public decimal MonthlyRateOfIntrest { get; set; }
        public decimal LatePaymentCharges_PerDay { get; set; }
        public int MonthNo { get; set; }
        public int YearNo { get; set; }
    }

    public class SavingGroupResponseDto
    {
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public string SGName { get; set; }
        public string Message { get; set; }
    }

    public class SavingGroupLoginDto
    {
        public string SGMobileNo { get; set; }
        public string SGPassword { get; set; }
    }

    public class SavingGroupLoginResponseDto
    {
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int? MemberId { get; set; }
        public string SGName { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }

    public class AuthResponseDto
    {
        public int? SGId { get; set; }
        public int? MonthId { get; set; }
        public int? MemberId { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }

    public class AuthRequestDto
    {
        public bool IsMemberLogin { get; set; }        
        public int? SGId { get; set; }
        public string MobileNo { get; set; }
        public string Password { get; set; }

        
    }
}
