using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BachatGatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("saving-pending/{sgId}")]
        public async Task<ActionResult<List<SavingPendingReportDto>>> GetSavingPendingReport(int sgId)
        {
            var result = await _service.GetSavingPendingReport(sgId);
            return Ok(result);
        }

        [HttpGet("loan-pending/{sgId}")]
        public async Task<ActionResult<List<LoanPendingReportDto>>> GetLoanPendingReport(int sgId)
        {
            var result = await _service.GetLoanPendingReport(sgId);
            return Ok(result);
        }

        [HttpGet("intrest-pending/{sgId}")]
        public async Task<ActionResult<List<IntrestPendingReportDto>>> GetIntrestPendingReport(int sgId)
        {
            var result = await _service.GetIntrestPendingReport(sgId);
            return Ok(result);
        }

        [HttpGet("late-payment-pending/{sgId}")]
        public async Task<ActionResult<List<LatePaymetPendingReportDto>>> GetLatePaymentPendingReport(int sgId)
        {
            var result = await _service.GetLatePaymentPendingReport(sgId);
            return Ok(result);
        }

        [HttpGet("member-report/{sgId}")]
        public async Task<ActionResult<List<MemberReportDto>>> GetMemberReport(int sgId)
        {
            var result = await _service.GetMemberReport(sgId);
            return Ok(result);
        }

        [HttpGet("month-deposit/{sgId}/{monthId}")]
        public async Task<ActionResult<List<MonthDepositReportDto>>> GetMonthDepositReport(int sgId, int monthId)
        {
            var result = await _service.GetMonthDepositReport(sgId, monthId);
            return Ok(result);
        }

        [HttpGet("month-pending/{sgId}/{monthId}")]
        public async Task<ActionResult<List<MonthPendingReportDto>>> GetMonthPendingReport(int sgId, int monthId)
        {
            var result = await _service.GetMonthPendingReport(sgId, monthId);
            return Ok(result);
        }

        [HttpGet("months/{sgId}")]
        public async Task<ActionResult<List<MonthDto>>> GetMonths(int sgId)
        {
            var result = await _service.GetMonths(sgId);
            return Ok(result);
        }

        [HttpGet("members/{sgId}")]
        public async Task<ActionResult<List<MemberDataDto>>> GetMembers(int sgId)
        {
            var result = await _service.GetMembers(sgId);
            return Ok(result);
        }
    }
}
