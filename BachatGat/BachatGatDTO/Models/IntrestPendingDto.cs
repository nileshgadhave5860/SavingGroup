namespace BachatGatDTO.Models
{
    public class IntrestPendingDto
    {
     public int MemberId{get;set;}
     public string MemberName{get;set;} = null!;
      public int  NoOfMonth{get;set;}
      public decimal  IntrestPending{get;set;}

    }
    public class IntrestPendingByMemberDto
    {
      public int ITId{get;set;}
      public int MonthId{get;set;}
      public String  MonthName{get;set;} = null!;
      public decimal  IntrestPending{get;set;}

    }
    public class IntrestTrasactionResponseDto
  {
        public bool  Success {get;set;}
         public string  Message {get;set;} = null!;
  }
  public class IntrestTrasactionUpdateDto
  {
        public int ITId { get; set; }       
        public int PaymentType { get; set; }
        public decimal DepositIntrestAmount { get; set; }
  }
}