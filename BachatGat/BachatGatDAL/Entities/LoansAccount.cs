using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("LoansAccount")]
    public class LoansAccount
    {
        [Key]
        public int LoanId { get; set; }
        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }
        [ForeignKey("Member")]
        public int MemberId { get; set; }
        public int PaymentType { get; set; }
        public Guid TransactionId { get; set; }
        public decimal LoanAmount { get; set; }
        public decimal RepaymentAmount { get; set; }
        public double InterestRate { get; set; }
        public int TermInMonths { get; set; }
        public decimal MonthlyInstallment { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsCompleted { get; set; }
        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
        public Member Member { get; set; } = null!;
    }
}