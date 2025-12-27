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
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public int MemberId { get; set; }
        public Guid? TrasactionId { get; set; }
        public int? PaymentType { get; set; }
        public decimal OutstandingIntrestAmount { get; set; }=0;
        public decimal CurrentIntrestAmount { get; set; }=0;
        public decimal DepositIntrestAmount { get; set; }=0;
        public DateTime Createddate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
