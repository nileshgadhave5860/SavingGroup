using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemberController : ControllerBase
    {
        private readonly IMemberService _service;

        public MemberController(IMemberService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public async Task<ActionResult<CreateMemberResponseDto>> CreateMember([FromBody] CreateMemberDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.CreateMember(request);
                if (!result.Success)
                    return BadRequest(result);

                return CreatedAtAction(nameof(CreateMember), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult<UpdateMemberResponseDto>> UpdateMember([FromBody] UpdateMemberDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.UpdateMember(request);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{memberId}/activate")]
        public async Task<ActionResult<MemberStatusResponseDto>> ActivateMember(int memberId)
        {
            try
            {
                var result = await _service.ActivateMember(memberId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{memberId}/deactivate")]
        public async Task<ActionResult<MemberStatusResponseDto>> DeactivateMember(int memberId)
        {
            try
            {
                var result = await _service.DeactivateMember(memberId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetMemberDataBySGID/{sgId}")]
        public async Task<ActionResult<GetMemberBySGIdResponseDto>> GetMemberDataBySGID(int sgId)
        {
            try
            {
                var result = await _service.GetMemberDataBySGId(sgId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
