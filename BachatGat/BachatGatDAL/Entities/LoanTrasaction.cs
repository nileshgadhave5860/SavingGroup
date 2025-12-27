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
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int MemberId { get; set; }
        public decimal PreviousLoanAmount { get; set; }=0;
        public decimal CurrentLoanAmount { get; set; }=0;
        public Guid? CurrentTrasactionId { get; set; }
        public int? CurrentLoanPaymentType { get; set; }
        public DateTime? CurrentLoanDate { get; set; }
        public decimal RepaidLoanAmount { get; set; }=0;
        public Guid? RepaidTrasactionId { get; set; }
        public int? RepaidPaymentType { get; set; }
        public DateTime? RepaidDate { get; set; }
        public DateTime Createddate { get; set; }
    }
}
