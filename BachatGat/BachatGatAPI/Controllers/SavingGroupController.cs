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
    }
}
