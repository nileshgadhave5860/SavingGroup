using BachatGatDTO.Models;

namespace BachatGatDAL.Interfaces
{
    public interface IMemberRepository
    {
        Task<CreateMemberResponseDto> CreateMember(CreateMemberDto request);
        Task<UpdateMemberResponseDto> UpdateMember(UpdateMemberDto request);
        Task<MemberStatusResponseDto> ActivateMember(int memberId);
        Task<MemberStatusResponseDto> DeactivateMember(int memberId);
        Task<MemberLoginResponseDto> Authenticate(MemberLoginDto request);
    }
}
