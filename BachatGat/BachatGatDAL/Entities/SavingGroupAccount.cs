using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("SavingGroupAccount")]
    public class SavingGroupAccount
    {
        [Key]public int SGId {get;set;}
	public string SGName {get;set;}
	public string SGAddress {get;set;}
	public string SGMobileNo {get;set;}
	public string SGEmailId {get;set;}
	public byte[] SGPassword {get;set;}
	public bool SGISActive {get;set;}
	public int MonthStartDate {get;set;}
	public int MonthEndDate {get;set;}
	public decimal MonthlySavingAmount {get;set;}
	public decimal LatePaymentCharges_PerDay {get;set;}
	public DateTime created_at {get;set;}
	public DateTime? updated_at {get;set;}
	public decimal? InterestEarned {get;set;}
	public Guid? TransactionId {get;set;}

        // Navigation Property
        public ICollection<MonthMaster> MonthMasters { get; set; } = new List<MonthMaster>();
        // Members navigation
        public ICollection<Member> Members { get; set; } = new List<Member>();
    }
}
