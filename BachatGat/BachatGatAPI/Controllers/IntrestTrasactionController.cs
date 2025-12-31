using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IntrestTrasactionController : ControllerBase
    {
        private readonly IIntrestTrasactionSerivce _service;

        public IntrestTrasactionController(IIntrestTrasactionSerivce service)
        {
            _service = service;
        }
        [HttpGet("IntrestPending/{SGId}")]
        public async Task<ActionResult<List<IntrestPendingDto>>> IntrestPending(int SGId)
        {
            try
            {
                var result = await _service.IntrestPending(SGId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("IntrestPendingByMember/{SGId}/{MemberId}")]
        public async Task<ActionResult<List<IntrestPendingByMemberDto>>> IntrestPendingByMember(int SGId,int MemberId)
        {
            try
            {
                var result = await _service.IntrestPendingByMember(SGId,MemberId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpPut("UpdateIntrestTrasaction")]
        public async Task<ActionResult<IntrestTrasactionResponseDto>> UpdateIntrestTrasaction([ FromBody] List<IntrestTrasactionUpdateDto> requests)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.UpdateIntrestTrasaction(requests);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}