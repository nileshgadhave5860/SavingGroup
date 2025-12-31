using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonthController : ControllerBase
    {
        private readonly IMonthService _service;

        public MonthController(IMonthService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public async Task<ActionResult<CreateMonthResponseDto>> CreateMonth([FromBody] CreateMonthDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.CreateMonth(request);
                if (!result.Success)
                    return BadRequest(result);

                return CreatedAtAction(nameof(CreateMonth), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetLastMonth/{sgId}")]
        public async Task<ActionResult<GetLastMonthResponseDto>> GetLastMonth(int sgId)
        {
            try
            {
                var result = await _service.GetLastMonth(sgId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetMonthBySGId/{sgId}")]
        public async Task<ActionResult<GetMonthBySGIdResponseDto>> GetMonthBySGId(int sgId)
        {
            try
            {
                var result = await _service.GetMonthBySGId(sgId);
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
