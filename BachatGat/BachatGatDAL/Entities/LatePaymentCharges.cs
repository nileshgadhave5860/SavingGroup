using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("LatePaymentCharges")]
    public class LatePaymentCharges
{
    [Key]
	public int LPCID {get;set;}
    [ForeignKey("SavingGroupAccount")]
	public int SGId {get;set;}
    [ForeignKey("MonthMaster")]
	public int MonthId {get;set;}
    [ForeignKey("Member")]
	public int MemberId {get;set;}
	public int NoOfDay {get;set;}
	public decimal PerDayCharges {get;set;}
	public decimal Charges {get;set;}
	public decimal? ChargesDeposit {get;set;}
	public Guid? TransactionId {get;set;}
	public DateTime CreatedDate {get;set;}
	public DateTime? UpdatedDate {get;set;}
     public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
     public MonthMaster MonthMaster { get; set; } = null!;
     public Member Member { get; set; } = null!;
}
}