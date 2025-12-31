using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavingTrasactionController : ControllerBase
    {
        private readonly ISavingTrasactionService _service;

        public SavingTrasactionController(ISavingTrasactionService service)
        {
            _service = service;
        }
        [HttpGet("SavingPending/{SGId}")]
        public async Task<ActionResult<List<SavingPendingDto>>> SavingPending(int SGId)
        {
            try
            {
                var result = await _service.SavingPending(SGId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpGet("SavingPendingByMember/{SGId}/{MemberId}")]
        public async Task<ActionResult<List<SavingPendingByMemberDto>>> SavingPendingByMember(int SGId,int MemberId)
        {
            try
            {
                var result = await _service.SavingPendingByMember(SGId,MemberId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("UpdateSavingTrasaction")]
        public async Task<ActionResult<SavingTrasactionUpdateResposneDto>> UpdateSavingTrasaction([FromBody] List<SavingTrasactionUpdateDto> requests)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.UpdateSavingTrasactionAsync(requests);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        


    }
}
