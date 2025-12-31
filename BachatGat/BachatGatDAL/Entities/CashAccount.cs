using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("CashAccount")]
    public class CashAccount
    {
        [Key]
        public int CashId { get; set; }

        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }

        [ForeignKey("MonthMaster")]
        public int MonthId { get; set; }

        public string Particulars { get; set; } = null!;
        public decimal CrAmount { get; set; }
        public decimal DrAmount { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public Guid TransactionId { get; set; }

        // Navigation properties
        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
        public MonthMaster MonthMaster { get; set; } = null!;
    }
}
