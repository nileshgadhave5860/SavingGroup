using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansAccountController : ControllerBase
    {
        private readonly ILoansAccountService _service;

        public LoansAccountController(ILoansAccountService service)
        {
            _service = service;
        }

        [HttpGet("GetLoanAccounts/{sgId}")]
        public async Task<ActionResult<List<LoanAccountResponseDto>>> GetLoanAccounts(int sgId)
        {
            try
            {
                var result = await _service.GetLoanAccounts(sgId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetLoanMembers/{sgId}")]
        public async Task<ActionResult<List<LoanMemberDto>>> GetLoanMembers(int sgId)
        {
            try
            {
                var result = await _service.GetLoanMembers(sgId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult<UpdateLoanResponseDto>> CreateLoanAccount([FromBody] LoansAccountRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.CreateLoanAccount(request);
                if (!result.Success)
                    return BadRequest(result);

                return CreatedAtAction(nameof(CreateLoanAccount), result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult<UpdateLoanResponseDto>> UpdateLoanAccount([FromBody] LoansAccountRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.UpdateLoanAccount(request);
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
