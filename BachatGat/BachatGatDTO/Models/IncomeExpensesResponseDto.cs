namespace BachatGatDTO.Models
{
    public class IncomeExpensesResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }

    public class IncomeExpensesRequestDto
    {
    public int SGId {get;set;}
	public int MonthId {get;set;}
	public string Particulars {get;set;} = null!;
    public int PaymentType {get;set;}
    public int IncomeExpensesType {get;set;} // 1 for Income, 2 for Expenses
	public decimal Amount {get;set;}
    }

    public class UpdateIncomeExpensesDto
    {
        public int IEId {get;set;}
        public string Particulars {get;set;} = null!;
        public decimal Amount {get;set;}
        public int IncomeExpensesType {get;set;} // 1 for Income, 2 for Expenses
    }

    public class IncomeExpensesAccountDto
    {public int IEId {get;set;}
	public int SGId {get;set;}
	public int MonthId {get;set;}
    public int MonthName {get;set;}
	public string Particulars {get;set;} = null!;
    public int PaymentType {get;set;}
	public decimal Income {get;set;}
	public decimal Expenses {get;set;}
	public DateTime UpdatedDate {get;set;}
	public DateTime CreatedDate {get;set;}
        
    }
}