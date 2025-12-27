using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Linq;

namespace BachatGatDAL.Repositories
{
    public class SavingGroupRepository : ISavingGroupRepository
    {
        private readonly AppDbContext _context;

        public SavingGroupRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<SavingGroupAccount>> GetAllSavingGroups()
        {
            return await _context.SavingGroupAccounts.ToListAsync();
        }
        public async Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request)
        {
            try
            {
                // Create SavingGroupAccount entity
                var savingGroupAccount = new SavingGroupAccount
                {
                    SGName = request.SGName,
                    SGAddress = request.SGAddress,
                    SGMobileNo = request.SGMobileNo,
                    SGEmailId = request.SGEmailId,
                    SGPassword = System.Text.Encoding.UTF8.GetBytes(request.SGPassword),
                    SGISActive = true,
                    MonthStartDate = request.MonthStartDate,
                    MonthEndDate = request.MonthEndDate,
                    MonthlySavingAmount = request.MonthlySavingAmount,
                    MonthlyRateOfIntrest = request.MonthlyRateOfIntrest,
                    LatePaymentCharges_PerDay = request.LatePaymentCharges_PerDay,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now
                };

                _context.SavingGroupAccounts.Add(savingGroupAccount);
                await _context.SaveChangesAsync();

                // Create MonthMaster entity
                var monthNames = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
                var monthName = $"{monthNames[request.MonthNo - 1]}-{request.YearNo}";

                var monthMaster = new MonthMaster
                {
                    SGId = savingGroupAccount.SGId,
                    MonthName = monthName,
                    MonthNo = request.MonthNo,
                    YearNo = request.YearNo,
                    Createddate = DateTime.Now
                };

                _context.MonthMasters.Add(monthMaster);
                await _context.SaveChangesAsync();

                return new SavingGroupResponseDto
                {
                    SGId = savingGroupAccount.SGId,
                    MonthId = monthMaster.MonthId,
                    SGName = savingGroupAccount.SGName,
                    Message = "Saving Group registered successfully!"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error registering saving group: {ex.Message}");
            }
        }

        public async Task<SavingGroupLoginResponseDto> Authenticate(SavingGroupLoginDto request)
        {
            try
            {
                var sg = await _context.SavingGroupAccounts.FirstOrDefaultAsync(s => s.SGMobileNo == request.SGMobileNo && s.SGISActive==true);
                if (sg == null)
                {
                    return new SavingGroupLoginResponseDto { Success = false, Message = "Invalid credentials" };
                }

                var provided = Encoding.UTF8.GetBytes(request.SGPassword ?? string.Empty);
                if (!sg.SGPassword.SequenceEqual(provided))
                {
                    return new SavingGroupLoginResponseDto { Success = false, Message = "Invalid credentials" };
                }

                var latestMonth = await _context.MonthMasters.Where(m => m.SGId == sg.SGId)
                    .OrderByDescending(m => m.Createddate)
                    .FirstOrDefaultAsync();

                return new SavingGroupLoginResponseDto
                {
                    SGId = sg.SGId,
                    SGName = sg.SGName,
                    MonthId = latestMonth?.MonthId ?? 0,
                    Success = true,
                    Message = "Authenticated"
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error authenticating saving group: {ex.Message}");
            }
        }
    }
}
