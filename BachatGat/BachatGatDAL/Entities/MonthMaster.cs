using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("MonthMaster")]
    public class MonthMaster
    {
        [Key]
        public int MonthId { get; set; }
        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }
        public int PreMonthId { get; set; }
        public string MonthName { get; set; } = null!;
        public int MonthNo { get; set; }
        public int YearNo { get; set; }
        public DateTime Createddate { get; set; }

        // Navigation Property
        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
    }
}
