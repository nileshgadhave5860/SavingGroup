using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BachatGatDAL.Entities
{
    [Table("IncomeExpensesAccount")]
   public class IncomeExpensesAccount
   {
    [Key]
    public int IEId {get;set;}
	[ForeignKey("SavingGroupAccount")]
	public int SGId {get;set;}
	[ForeignKey("MonthMaster")]
	public int MonthId {get;set;}
	public string Particulars {get;set;}
	public decimal Income {get;set;}
	public decimal Expenses {get;set;}
	public DateTime UpdatedDate {get;set;}
	public DateTime CreatedDate {get;set;}
	public Guid TransactionId {get;set;}
	public int PaymentType {get;set;}

        public SavingGroupAccount SavingGroupAccount { get; set; } = null!;
        public MonthMaster MonthMaster { get; set; } = null!;
       
  }
}