using Microsoft.AspNetCore.Mvc;
using BachatGatBAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace BachatGatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMemberService _memberService;
        private readonly ISavingGroupService _savingGroupService;
        private readonly IConfiguration _config;

        public AuthController(IMemberService memberService, ISavingGroupService savingGroupService, IConfiguration config)
        {
            _memberService = memberService;
            _savingGroupService = savingGroupService;
            _config = config;
        }

        [HttpPost("signin")]
        public async Task<ActionResult<AuthResponseDto>> SignIn([FromBody] AuthRequestDto request)
        {
            try
            {
                if (request.IsMemberLogin)
                {
                    // Member login
                    if (!request.SGId.HasValue || string.IsNullOrWhiteSpace(request.MobileNo) || string.IsNullOrWhiteSpace(request.Password))
                        return BadRequest(new { message = "SGId, MobileNo and Password are required for member login" });

                    var memberReq = new MemberLoginDto
                    {
                        SGId = request.SGId.Value,
                        MobileNo = request.MobileNo,
                        Password = request.Password
                    };

                    var result = await _memberService.Authenticate(memberReq);
                    if (result == null || !result.Success)
                        return Unauthorized(new { message = result?.Message ?? "Unauthorized" });

                    var claims = new List<Claim>
                    {
                        new Claim("MemberId", result.MemberId.ToString()),
                        new Claim("SGId", result.SGId.ToString()),
                        new Claim("MemberName", result.MemberName ?? string.Empty),
                        new Claim(ClaimTypes.Role, "Member")
                    };

                    var token = GenerateToken(claims);

                    var unified = new AuthResponseDto
                    {
                        MemberId = result.MemberId,
                        SGId = result.SGId,
                        MonthId = result.MonthId,
                        Name = result.MemberName,
                        Role = "Member",
                        Success = result.Success,
                        Message = result.Message,
                        Token = token
                    };

                    return Ok(unified);
                }
                else
                {
                    // Saving Group login
                    if (string.IsNullOrWhiteSpace(request.MobileNo) || string.IsNullOrWhiteSpace(request.Password))
                        return BadRequest(new { message = "MobileNo and Password are required for saving group login" });

                    var sgReq = new SavingGroupLoginDto
                    {
                        SGMobileNo = request.MobileNo,
                        SGPassword = request.Password
                    };

                    var result = await _savingGroupService.Authenticate(sgReq);
                    if (result == null || !result.Success)
                        return Unauthorized(new { message = result?.Message ?? "Unauthorized" });

                    var claims = new List<Claim>
                    {
                        new Claim("SGId", result.SGId.ToString()),
                        new Claim("SGName", result.SGName ?? string.Empty),
                        new Claim(ClaimTypes.Role, "SavingGroup")
                    };

                    var token = GenerateToken(claims);

                    var unified = new AuthResponseDto
                    {
                        SGId = result.SGId,
                        MonthId = result.MonthId,
                        Name = result.SGName,
                        Role = "SavingGroup",
                        Success = result.Success,
                        Message = result.Message,
                        Token = token
                    };

                    return Ok(unified);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var keyString = _config["Jwt:Key"] ?? string.Empty;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiresMinutes = 60;
            int.TryParse(_config["Jwt:ExpiresMinutes"], out expiresMinutes);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
