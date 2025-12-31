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
        public string FullName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string MobileNo { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public PaymentType PaymentType { get; set; }
        public decimal Deposit { get; set; }
        public int MonthId { get; set; }
    }

    public class CreateMemberResponseDto
    {
        public int MemberId { get; set; }
        public string FullName { get; set; } = null!;
        public Guid TransactionId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }

    public class UpdateMemberDto
    {
        public int MemberId { get; set; }
        public string FullName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string MobileNo { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Password { get; set; }
        public PaymentType PaymentType { get; set; }
        public decimal Deposit { get; set; }
        public int MonthId { get; set; }
    }

    public class UpdateMemberResponseDto
    {
        public int MemberId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
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
        public string Message { get; set; } = null!;
    }

    public class MemberLoginDto
    {
        public int SGId { get; set; }
        public string MobileNo { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class MemberLoginResponseDto
    {
        public int MemberId { get; set; }
        public int SGId { get; set; }
        public int MonthId { get; set; }
        public string MemberName { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public string Token { get; set; } = null!;
    }

    public class MemberBySGIdDto
    {
        public int MemberId { get; set; }
        public string FullName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string MobileNo { get; set; } = null!;
        public string Email { get; set; } = null!;
        public decimal TotalSaving { get; set; }
        public decimal TotalLoan { get; set; }
        public decimal Deposit { get; set; }
        public bool IsActive { get; set; }
        public PaymentType PaymentType { get; set; }
    }

    public class GetMemberBySGIdResponseDto
    {
        public List<MemberBySGIdDto> Members { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }
}
