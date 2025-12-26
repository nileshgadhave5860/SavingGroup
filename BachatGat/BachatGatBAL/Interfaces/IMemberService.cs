using BachatGatDTO.Models;

namespace BachatGatBAL.Interfaces
{
    public interface IMemberService
    {
        Task<CreateMemberResponseDto> CreateMember(CreateMemberDto request);
        Task<UpdateMemberResponseDto> UpdateMember(UpdateMemberDto request);
        Task<MemberStatusResponseDto> ActivateMember(int memberId);
        Task<MemberStatusResponseDto> DeactivateMember(int memberId);
        Task<MemberLoginResponseDto> Authenticate(MemberLoginDto request);
        Task<GetMemberBySGIdResponseDto> GetMemberDataBySGId(int sgId);
    }
}
