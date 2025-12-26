namespace BachatGatDTO.Models
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Balance { get; set; }
    }

    public class CreateMemberDto
    {
        public int SGId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public PaymentType PaymentType { get; set; }
        public decimal Deposit { get; set; }
        public int MonthId { get; set; }
    }

    public class CreateMemberResponseDto
    {
        public int MemberId { get; set; }
        public string FullName { get; set; }
        public Guid TransactionId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class UpdateMemberDto
    {
        public int MemberId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public PaymentType PaymentType { get; set; }
        public decimal Deposit { get; set; }
        public int MonthId { get; set; }
    }

    public class UpdateMemberResponseDto
    {
        public int MemberId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class MemberStatusActionDto
    {
        public int MemberId { get; set; }
    }

    public class MemberStatusResponseDto
    {
        public int MemberId { get; set; }
        public bool IsActive { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class MemberLoginDto
    {
        public int SGId { get; set; }
        public string MobileNo { get; set; }
        public string Password { get; set; }
    }

    public class MemberLoginResponseDto
    {
        public int MemberId { get; set; }
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public string MemberName { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }

    public class MemberBySGIdDto
    {
        public int MemberId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public decimal TotalSaving { get; set; }
        public decimal TotalLoan { get; set; }
        public decimal Deposit { get; set; }
        public bool IsActive { get; set; }
        public PaymentType PaymentType { get; set; }
    }

    public class GetMemberBySGIdResponseDto
    {
        public List<MemberBySGIdDto> Members { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
