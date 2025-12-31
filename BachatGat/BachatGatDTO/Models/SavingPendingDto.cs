namespace BachatGatDTO.Models
{
    public class SavingPendingDto
    {
     public int MemberId{get;set;}
     public string MemberName{get;set;} = null!;
      public int  NoOfMonth{get;set;}
      public decimal  SavingPending{get;set;}

    }
    public class SavingPendingByMemberDto
    {
      public int STId{get;set;}
      public String  MonthName{get;set;} = null!;
      public decimal  SavingPending{get;set;}

    }
    public class SavingTrasactionResponseDto
  {
                  public int STID{get;set;} 
                   public Guid? TransactionId{get;set;}
                   public bool  Success {get;set;}
                   public string  Message {get;set;} = null!;
  }
  public class SavingTrasactionUpdateResposneDto
  {
              
        public bool  Success {get;set;}
         public string  Message {get;set;} = null!;
  }
  public class SavingTrasactionUpdateDto
  {
        public int STId { get; set; }       
        public int PaymentType { get; set; }
        public decimal DepositSavingAmount { get; set; }
  }
}