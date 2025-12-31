namespace BachatGatDTO.Models
{
    public class CreateLoanTrasactionDto
    {
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int MemberId { get; set; }
        public int LoanId { get; set; }
        public int PaymentType { get; set; }
        public decimal RepaidLoanAmount { get; set; }
    }

    public class UpdateLoanTrasactionDto
    {
        public int LTId { get; set; }
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int MemberId { get; set; }
        public int LoanId { get; set; }
        public int PaymentType { get; set; }
        public decimal RepaidLoanAmount { get; set; }
    }

    public class LoanTrasactionResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public int LTId { get; set; }
    }

    public class DeleteLoanTrasactionResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }

    public class LoanTrasactionDetailDto
    {
        public int LTId { get; set; }
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int MemberId { get; set; }
        public string MemberName { get; set; } = null!;
        public int LoanId { get; set; }
        public int PaymentType { get; set; }
        public decimal RepaidLoanAmount { get; set; }
        public Guid TrasactionId { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime Createddate { get; set; }
    }

    public class GetLoanTrasactionByLoanIdResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public List<LoanTrasactionDetailDto> LoanTrasactions { get; set; } = new List<LoanTrasactionDetailDto>();
    }
}
