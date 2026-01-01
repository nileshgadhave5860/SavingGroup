namespace BachatGatDTO.Models
{
    public class LatePaymentChargesReposnseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }
    public class LatePaymentChargesRequestDto
    {
        public int lpcId { get; set; }
       
        public decimal depositAmount { get; set; }
    }
    public class LatePaymentChargesAccountDto
    {
        public int LPCID { get; set; }
        public string MemberName { get; set; }
        public string MonthName { get; set; }
        public int NoOfDay { get; set; }
        public decimal PerDayCharges { get; set; }
        public decimal Charges { get; set; }
        public decimal ChargesDeposit { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

}