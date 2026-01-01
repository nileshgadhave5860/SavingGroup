using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeExpensesController : ControllerBase
    {
        private readonly IIncomeExpensesService _service;

        public IncomeExpensesController(IIncomeExpensesService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public async Task<ActionResult<IncomeExpensesResponseDto>> CreateIncomeExpense([FromBody] IncomeExpensesRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.IncomeExpenseCreate(request);
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetBySGId/{sgId}")]
        public async Task<ActionResult<List<IncomeExpensesAccountDto>>> GetIncomeExpensesBySGId(int sgId)
        {
            try
            {
                var result = await _service.GetIncomeExpensesBySGId(sgId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{ieId}")]
        public async Task<ActionResult<IncomeExpensesResponseDto>> DeleteIncomeExpense(int ieId)
        {
            try
            {
                var result = await _service.DeleteIncomeExpense(ieId);
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
        public async Task<ActionResult<IncomeExpensesResponseDto>> UpdateIncomeExpense([FromBody] UpdateIncomeExpensesDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.UpdateIncomeExpense(request);
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
