using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using BachatGatBAL.Interfaces;

namespace BachatGatBAL.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _repository;

        public MemberService(IMemberRepository repository)
        {
            _repository = repository;
        }

        public async Task<CreateMemberResponseDto> CreateMember(CreateMemberDto request)
        {
            return await _repository.CreateMember(request);
        }

        public async Task<UpdateMemberResponseDto> UpdateMember(UpdateMemberDto request)
        {
            return await _repository.UpdateMember(request);
        }

        public async Task<MemberStatusResponseDto> ActivateMember(int memberId)
        {
            return await _repository.ActivateMember(memberId);
        }

        public async Task<MemberStatusResponseDto> DeactivateMember(int memberId)
        {
            return await _repository.DeactivateMember(memberId);
        }

        public async Task<MemberLoginResponseDto> Authenticate(MemberLoginDto request)
        {
            return await _repository.Authenticate(request);
        }
    }
}
