using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BachatGatDAL.Entities
{
    [Table("LoanTrasaction")]
    public class LoanTrasaction
    {
        [Key]
        public int LTId { get; set; }
        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }
        [ForeignKey("MonthMaster")]
        public int MonthId { get; set; }
        [ForeignKey("Member")]
        public int MemberId { get; set; }
        [ForeignKey("LoansAccount")]
        public int LoanId { get; set; }
        public int PaymentType { get; set; }
        public decimal RepaidLoanAmount { get; set; }
        public Guid TrasactionId { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime Createddate { get; set; }
        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
        public MonthMaster MonthMaster { get; set; } = null!;
        public Member Member { get; set; } = null!;
        public LoansAccount LoansAccount { get; set; } = null!;
    }
}
