using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanTrasactionController : ControllerBase
    {
        private readonly ILoanTrasactionService _service;

        public LoanTrasactionController(ILoanTrasactionService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public async Task<ActionResult<LoanTrasactionResponseDto>> CreateLoanTrasaction([FromBody] CreateLoanTrasactionDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.CreateLoanTrasaction(request);
                if (!result.Success)
                    return BadRequest(result);

                return CreatedAtAction(nameof(CreateLoanTrasaction), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult<LoanTrasactionResponseDto>> UpdateLoanTrasaction([FromBody] UpdateLoanTrasactionDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.UpdateLoanTrasaction(request);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{ltId}")]
        public async Task<ActionResult<DeleteLoanTrasactionResponseDto>> DeleteLoanTrasaction(int ltId)
        {
            try
            {
                var result = await _service.DeleteLoanTrasaction(ltId);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("loan/{loanId}")]
        public async Task<ActionResult<GetLoanTrasactionByLoanIdResponseDto>> GetLoanTrasactionByLoanId(int loanId)
        {
            try
            {
                var result = await _service.GetLoanTrasactionByLoanId(loanId);
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
