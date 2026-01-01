using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LatePaymentChargesController : ControllerBase
    {
        private readonly ILatePaymentChargesService _service;

        public LatePaymentChargesController(ILatePaymentChargesService service)
        {
            _service = service;
        }

        [HttpPost("auto-calculate/{sgId}")]
        public async Task<ActionResult<LatePaymentChargesReposnseDto>> AutoCalculateLatePaymentCharges(int sgId)
        {
            try
            {
                var result = await _service.AutoCalculateLatePaymentCharges(sgId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("pending/{sgId}")]
        public async Task<ActionResult<List<LatePaymentChargesAccountDto>>> GetPendingLatePaymentCharges(int sgId)
        {
            try
            {
                var result = await _service.GetPendingLatePaymentCharges(sgId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("delete/{lpcId}")]
        public async Task<ActionResult<LatePaymentChargesReposnseDto>> DeleteLatePaymentCharge(int lpcId)
        {
            try
            {
                var result = await _service.DeleteLatePaymentCharge(lpcId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult<LatePaymentChargesReposnseDto>> UpdateLatePaymentCharge([FromBody] LatePaymentChargesRequestDto request)
        {
            try
            {
                var result = await _service.UpdateLatePaymentCharge(request.lpcId, request.depositAmount);
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
