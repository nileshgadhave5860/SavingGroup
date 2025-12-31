namespace BachatGatDTO.Models
{
    public class LoanAccountResponseDto
    {
        public int LoanId { get; set; }       
        public int SGId { get; set; }     
        
        public int MemberId { get; set; }
        public string MemberName { get; set; } = null!;
        public int PaymentType { get; set; }       
        public decimal LoanAmount { get; set; }
        public decimal RepaymentAmount { get; set; }
        public decimal PendingLoanAmount { get; set; }
        public double InterestRate { get; set; }
        public int TermInMonths { get; set; }
        public decimal MonthlyInstallment { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class LoansAccountRequestDto
    {
        
        public int? LoanId { get; set; }=0;
        public int SGId { get; set; }
         public int MonthId { get; set; } 
        public int MemberId { get; set; }
          public string MemberName { get; set; } = null!;
        public int PaymentType { get; set; }       
        public decimal LoanAmount { get; set; }        
        public double InterestRate { get; set; }
        public int TermInMonths { get; set; }
        public decimal MonthlyInstallment { get; set; }
        
    }
    public class UpdateLoanResponseDto
    {
        public int LoanId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }

    public class LoanMemberDto
    {
        public int MemberId { get; set; }
        public string MemberName { get; set; } = null!;
    }
}