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

        public string FullName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string MobileNo { get; set; } = null!;
        public string Email { get; set; } = null!;
        public decimal TotalSaving { get; set; }
        public decimal TotalLoan { get; set; }
        public decimal Deposit { get; set; }
        public byte[] Password { get; set; } = null!;
        public bool IsActive { get; set; }
        public PaymentType PaymentType { get; set; }
        public Guid TransactionId { get; set; }

        // Navigation property
        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
    }
}
