using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BachatGatDAL.Entities
{
    [Table("IntrestTrasaction")]
    public class IntrestTrasaction
    {
        [Key]
        public int ITId { get; set; }
        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }

        [ForeignKey("MonthMaster")]
        public int MonthId { get; set; }

        [ForeignKey("Member")]

        public int MemberId { get; set; }
        public Guid? TrasactionId { get; set; }
        public int? PaymentType { get; set; }
        public decimal OutstandingIntrestAmount { get; set; }=0;
        public decimal CurrentIntrestAmount { get; set; }=0;
        public decimal DepositIntrestAmount { get; set; }=0;
        public DateTime Createddate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
        public MonthMaster MonthMaster { get; set; } = null!;
        public Member Member { get; set; } = null!;

    }
}
