namespace BachatGatDTO.Models
{
    public class BankResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    public class BankRequestDto
    {
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public decimal Amount { get; set; }
    
    }
}