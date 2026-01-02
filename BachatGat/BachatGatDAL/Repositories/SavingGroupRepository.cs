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
        /* public async Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request)
         {
             try
             {
                 Guid TransactionId = Guid.NewGuid();
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
                     InterestEarned = request.InterestEarned,
                     TransactionId = TransactionId,
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
                 if (savingGroupAccount.InterestEarned > 0)
                 {
                     CashAccount cashAccount = new CashAccount
                     {
                         SGId = savingGroupAccount.SGId,
                         MonthId = monthMaster.MonthId,
                         Particulars = "Initial Intrest Balance",
                         CrAmount = 0,
                         DrAmount = savingGroupAccount.InterestEarned,
                         CreatedDate = DateTime.Now,
                         UpdatedDate = DateTime.Now,
                         TransactionId = TransactionId
                     };
                 }


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
         }*/
        public async Task<SavingGroupResponseDto> RegisterSavingGroup(SavingGroupRegisterDto request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                Guid transactionId = Guid.NewGuid();

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
                    InterestEarned = request.InterestEarned,
                    TransactionId = transactionId,
                    LatePaymentCharges_PerDay = request.LatePaymentCharges_PerDay,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now
                };

                await _context.SavingGroupAccounts.AddAsync(savingGroupAccount);
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

                await _context.MonthMasters.AddAsync(monthMaster);
                await _context.SaveChangesAsync();

                // Create initial CashAccount if InterestEarned > 0
                if (savingGroupAccount.InterestEarned > 0)
                {
                    var cashAccount = new CashAccount
                    {
                        SGId = savingGroupAccount.SGId,
                        MonthId = monthMaster.MonthId,
                        Particulars = "Initial Interest Balance",
                        CrAmount = 0,
                        DrAmount = savingGroupAccount.InterestEarned.Value,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };

                    await _context.CashAccounts.AddAsync(cashAccount);
                    await _context.SaveChangesAsync();
                }

                // Commit transaction
                await transaction.CommitAsync();

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
                // Rollback if anything fails
                await transaction.RollbackAsync();
                throw new Exception($"Error registering saving group: {ex.Message}");
            }
        }

        public async Task<SavingGroupLoginResponseDto> Authenticate(SavingGroupLoginDto request)
        {
            try
            {
                var sg = await _context.SavingGroupAccounts.FirstOrDefaultAsync(s => s.SGMobileNo == request.SGMobileNo && s.SGISActive == true);
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


        public async Task<SavingGroupdashboardDto> GetSavingGroupDashboardData(int sgId)
        {
            var totalMembers = await _context.Members.CountAsync(m => m.SGId == sgId && m.IsActive);

            var totalDeposit = await _context.Members
                .Where(m => m.SGId == sgId && m.IsActive)
                .SumAsync(m => (decimal?)m.Deposit) ?? 0;
            var totalSavings = await _context.SavingTrasactions.Include(x => x.Member)
                .Where(st => st.SGId == sgId)
                .SumAsync(st => (decimal?)st.DepositSavingAmount) ?? 0;


            var totalIntrest = await _context.IntrestTrasactions
                .Where(lt => lt.SGId == sgId)
                .SumAsync(lt => (decimal?)lt.DepositIntrestAmount) ?? 0;

            var TotalLoans = await _context.LoansAccounts
                .Where(lt => lt.SGId == sgId)
                .SumAsync(lt => (decimal?)lt.LoanAmount - (decimal?)lt.RepaymentAmount) ?? 0;


            var CashBalance = await _context.CashAccounts
                .Where(cb => cb.SGId == sgId)
                .SumAsync(cb => (decimal?)cb.DrAmount - (decimal?)cb.CrAmount) ?? 0;

            var BankBalance = await _context.BankAccounts
                .Where(bb => bb.SGId == sgId)
                .SumAsync(bb => (decimal?)bb.DrAmount - (decimal?)bb.CrAmount) ?? 0;


            var SavingPendingMembersCount = await _context.SavingTrasactions
     .Where(sp => sp.SGId == sgId
         && ((sp.CurrentSavingAmount ?? 0) - (sp.DepositSavingAmount ?? 0)) > 0)
     .Select(sp => sp.MemberId)
     .Distinct()
     .CountAsync();

            var SavingPendingAmount = await _context.SavingTrasactions
                .Where(sp => sp.SGId == sgId && (sp.CurrentSavingAmount ?? 0) - (sp.DepositSavingAmount ?? 0) > 0)
                .SumAsync(sp => (decimal?)((sp.CurrentSavingAmount ?? 0) - (sp.DepositSavingAmount ?? 0))) ?? 0;

            var IntrestPendingMembersCount = await _context.IntrestTrasactions
                .Where(ip => ip.SGId == sgId && ip.CurrentIntrestAmount - ip.DepositIntrestAmount > 0)
                .Select(ip => ip.MemberId)
                .Distinct()
                .CountAsync();

            var IntrestPendingAmount = await _context.IntrestTrasactions
               .Where(ip => ip.SGId == sgId && ip.CurrentIntrestAmount - ip.DepositIntrestAmount > 0)
               .SumAsync(ip => (decimal?)(ip.CurrentIntrestAmount - ip.DepositIntrestAmount)) ?? 0;

            var SGName = await _context.SavingGroupAccounts
               .Where(sg => sg.SGId == sgId)
               .Select(sg => sg.SGName)
               .FirstOrDefaultAsync() ?? string.Empty;


            decimal TotalIncome = await _context.IncomeExpensesAccounts
               .Where(ie => ie.SGId == sgId)
               .SumAsync(ie => (decimal?)ie.Income) ?? 0;
            decimal TotalExpenses = await _context.IncomeExpensesAccounts
               .Where(ie => ie.SGId == sgId)
               .SumAsync(ie => (decimal?)ie.Expenses) ?? 0;
            decimal InterestEarned = await _context.SavingGroupAccounts
              .Where(sg => sg.SGId == sgId)
              .SumAsync(sg => (decimal?)sg.InterestEarned) ?? 0;

            totalIntrest = totalIntrest + InterestEarned;

            var dashboardData = new SavingGroupdashboardDto
            {
                SGId = sgId,
                SGName = SGName,
                TotalMembers = totalMembers,
                TotalSavings = totalSavings + totalDeposit,
                TotalInterestEarned = totalIntrest,
                TotalLoans = TotalLoans,
                CashBalance = CashBalance,
                BankBalance = BankBalance,
                TotalLateFeesCollected = 0,
                TotalIncome = TotalIncome,
                TotalExpenses = TotalExpenses,
                SavingPendingMembersCount = SavingPendingMembersCount,
                SavingPendingAmount = SavingPendingAmount,
                IntrestPendingMembersCount = IntrestPendingMembersCount,
                IntrestPendingAmount = IntrestPendingAmount,
                LateFeesPendingMembersCount = 0,
                LateFeesPendingAmount = 0,
                SavingsBalance = totalSavings + totalDeposit + totalIntrest - TotalLoans + TotalIncome - TotalExpenses

            };
            return dashboardData;
        }
        public async Task<MemberDashboardDto> GetMemberDashboardData(int sgId, int memberId)
        {

            var Memberdata = await _context.Members
                .Where(m => m.SGId == sgId && m.MemberId == memberId)
                .FirstOrDefaultAsync();

            if (Memberdata == null)
            {
                return new MemberDashboardDto
                {
                    MemberId = memberId,
                    FullName = string.Empty,
                    SavingPendingMonthsCount = 0,
                    SavingPendingAmount = 0,
                    IntrestPendingAmount = 0,
                    IntrestPendingMonthsCount = 0,
                    LateFeesPendingAmount = 0,
                    TotalLoan = 0,
                    TotalSavings = 0,
                    SavingGroupDetails = new SavingGroupdashboardDto()
                };
            }

            var savingPendingMonthsCount = await _context.SavingTrasactions
               .Where(st => st.SGId == sgId && st.MemberId == memberId && st.CurrentSavingAmount - st.DepositSavingAmount > 0)
               .CountAsync();
            var savingPendingAmount = await _context.SavingTrasactions
            .Where(st => st.SGId == sgId && st.MemberId == memberId && st.CurrentSavingAmount - st.DepositSavingAmount > 0)
            .SumAsync(st => (decimal?)(st.CurrentSavingAmount - st.DepositSavingAmount)) ?? 0;

            var intrestPendingMonthsCount = await _context.IntrestTrasactions
              .Where(it => it.SGId == sgId && it.MemberId == memberId && it.CurrentIntrestAmount - it.DepositIntrestAmount > 0)
              .CountAsync();
            var intrestPendingAmount = await _context.IntrestTrasactions
                .Where(it => it.SGId == sgId && it.MemberId == memberId && it.CurrentIntrestAmount - it.DepositIntrestAmount > 0)
                .SumAsync(it => (decimal?)(it.CurrentIntrestAmount - it.DepositIntrestAmount)) ?? 0;


            var TotalSaving=await _context.SavingTrasactions
                .Where(st => st.SGId == sgId && st.MemberId == memberId)
                .SumAsync(st => (decimal?)st.DepositSavingAmount) ?? 0;
 
            var TotalLoan=await _context.LoansAccounts
                .Where(lt => lt.SGId == sgId && lt.MemberId == memberId)
                .SumAsync(lt => (decimal?)lt.LoanAmount - (decimal?)lt.RepaymentAmount) ?? 0;

             var LateFeesPendingAmount=await _context.LatePaymentCharges
             .Where(x=>x.SGId==sgId && x.MemberId==memberId)
             .SumAsync(x=>(decimal)x.Charges-(decimal?)x.ChargesDeposit??0);

            var MemberDashboard = new MemberDashboardDto()
            {
                MemberId = memberId,
                FullName = Memberdata.FullName,
                SavingPendingMonthsCount = savingPendingMonthsCount,
                SavingPendingAmount = savingPendingAmount,
                IntrestPendingAmount = intrestPendingAmount,
                IntrestPendingMonthsCount = intrestPendingMonthsCount,
                LateFeesPendingAmount = LateFeesPendingAmount,
                TotalLoan = TotalLoan,
                TotalSavings =TotalSaving + Memberdata.Deposit,

                SavingGroupDetails = await GetSavingGroupDashboardData(sgId)
            };
            return MemberDashboard;
        }

    }
}
