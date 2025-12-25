using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BachatGatDTO.Models;

namespace BachatGatDAL.Entities
{
    [Table("Member")]
    public class Member
    {
        [Key]
        public int MemberId { get; set; }

        [ForeignKey("SavingGroupAccount")]
        public int SGId { get; set; }

        public string FullName { get; set; }
        public string Address { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public decimal TotalSaving { get; set; }
        public decimal TotalLoan { get; set; }
        public decimal Deposit { get; set; }
        public byte[] Password { get; set; }
        public bool IsActive { get; set; }
        public PaymentType PaymentType { get; set; }
        public Guid TransactionId { get; set; }

        // Navigation property
        public SavingGroupAccount SavingGroupAccount { get; set; }
    }
}
