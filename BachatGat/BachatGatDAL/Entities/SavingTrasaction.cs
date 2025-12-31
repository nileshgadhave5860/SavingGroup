using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("SavingTrasaction")]
    public class SavingTrasaction
    {
        [Key]
        public int STId { get; set; }

        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }

        [ForeignKey("MonthMaster")]
        public int MonthId { get; set; }

        [ForeignKey("Member")]
        public int MemberId { get; set; }

        public Guid? TrasactionId { get; set; }
        public int? PaymentType { get; set; }
        public decimal? OutstandingSavingAmount { get; set; }
        public decimal? CurrentSavingAmount { get; set; }
        public decimal? DepositSavingAmount { get; set; }
        public DateTime Createddate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        // Navigation properties
        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
        public MonthMaster MonthMaster { get; set; } = null!;
        public Member Member { get; set; } = null!;
    }
}
