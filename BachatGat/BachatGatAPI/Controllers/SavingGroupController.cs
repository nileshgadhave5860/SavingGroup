using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavingGroupController : ControllerBase
    {
        private readonly ISavingGroupService _service;

        public SavingGroupController(ISavingGroupService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<ActionResult<SavingGroupResponseDto>> Register([FromBody] SavingGroupRegisterDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.RegisterSavingGroup(request);
                return CreatedAtAction(nameof(Register), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("GetSavingGroupDashboardData/{sgId}")]
        public async Task<ActionResult<SavingGroupdashboardDto>> GetSavingGroupDashboardData(int sgId)
        {
            try
            {
                var result = await _service.GetSavingGroupDashboardData(sgId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("GetMemberDashboardData/{sgId}/{memberId}")]
        public async Task<ActionResult<MemberDashboardDto>> GetMemberDashboardData(int sgId, int memberId)
        {
            try
            {
                var result = await _service.GetMemberDashboardData(sgId, memberId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}
