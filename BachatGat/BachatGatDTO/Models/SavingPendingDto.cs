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

  public class PendingDepositdto
  {
    public int SGId{get;set;}
    public int MemberId{get;set;}
    public int MonthId{get;set;}
    public List<int>STIds{get;set;}=null!;
    public List<int>ITId{get;set;}=null!;
    public List<int>lpcId{get;set;}=null!;
    public decimal EMIAmount{get;set;}
    public int PaymentType{get;set;}
  }


}