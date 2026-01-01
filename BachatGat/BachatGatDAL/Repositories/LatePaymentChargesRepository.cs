using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Linq;

namespace BachatGatDAL.Repositories
{
    public class LatePaymentChargesRepository : ILatePaymentChargesRepository
    {
        private readonly AppDbContext _context;
        private readonly IMonthRepository _monthRepository;
        public LatePaymentChargesRepository(AppDbContext context, IMonthRepository monthRepository)
        {
            _context = context;
            _monthRepository = monthRepository;
        }
        
        public async Task<LatePaymentChargesReposnseDto> AutoCalculateLatePaymentCharges(int sgId)
        {
            
            int MonthId = _monthRepository.GetLastMonth(sgId).Result.MonthId;
            var SavingPendingMembers = await _context.SavingTrasactions
            .Where(sp => sp.SGId == sgId && sp.MonthId == MonthId && ((sp.CurrentSavingAmount ?? 0) - (sp.DepositSavingAmount ?? 0)) > 0)
            .Select(sp => sp.MemberId).ToListAsync();
            if (SavingPendingMembers != null)
            {
                var savingGroup = await _context.SavingGroupAccounts.FindAsync(sgId);                
                foreach (var memberId in SavingPendingMembers)
                {

                    var LatePaymentChargeEntity= await _context.LatePaymentCharges
                    .FirstOrDefaultAsync(lpc => lpc.SGId == sgId && lpc.MemberId == memberId && lpc.MonthId == MonthId);
                    if (LatePaymentChargeEntity != null)
                    {
                        // Update existing late payment charge
                        LatePaymentChargeEntity.NoOfDay = DateTime.Now.Day - savingGroup!.MonthEndDate;
                        LatePaymentChargeEntity.PerDayCharges = savingGroup!.LatePaymentCharges_PerDay;
                        LatePaymentChargeEntity.Charges = (DateTime.Now.Day - savingGroup!.MonthEndDate) * savingGroup!.LatePaymentCharges_PerDay;
                        LatePaymentChargeEntity.UpdatedDate = DateTime.Now;
                        _context.LatePaymentCharges.Update(LatePaymentChargeEntity);
                        _context.SaveChanges();
                    }
                    else
                    {
                        // Create new late payment charge

                    var LatePaymentCharge=new LatePaymentCharges
                    {
                        SGId = sgId,
                        MemberId = memberId,
                        MonthId = MonthId,
                        NoOfDay = DateTime.Now.Day - savingGroup!.MonthEndDate,
                        PerDayCharges = savingGroup!.LatePaymentCharges_PerDay,
                        Charges = (DateTime.Now.Day - savingGroup!.MonthEndDate) * savingGroup!.LatePaymentCharges_PerDay,
                         ChargesDeposit = 0,    
                         CreatedDate = DateTime.Now,                    
                    };
                    _context.LatePaymentCharges.Add(LatePaymentCharge);
                    _context.SaveChanges();
                    }
                    
                    
                }
            }
            var response = new LatePaymentChargesReposnseDto
                    {
                        Success = true,
                        Message = "Late Payment Charges Calculated Successfully"
                    };
                    return response;
        }

        //get pending late payment charges
        public async Task<List<LatePaymentChargesAccountDto>> GetPendingLatePaymentCharges(int sgId)
        {
            var latePaymentCharges = await _context.LatePaymentCharges.Include(x=>x.MonthMaster)
                .Include(x=>x.Member)
                .Where(lpc => lpc.SGId == sgId && (lpc.Charges - (lpc.ChargesDeposit ?? 0)) > 0)
                .Select(lpc => new LatePaymentChargesAccountDto
                {
                    LPCID = lpc.LPCID,
                    MemberName = lpc.Member!.FullName,
                    MonthName = lpc.MonthMaster!.MonthName,
                    NoOfDay = lpc.NoOfDay,
                    PerDayCharges = lpc.PerDayCharges,
                    Charges = lpc.Charges,
                    ChargesDeposit = lpc.ChargesDeposit ?? 0,
                    UpdatedDate = lpc.UpdatedDate ?? lpc.CreatedDate,
                    CreatedDate = lpc.CreatedDate
                })
                .ToListAsync();

            return latePaymentCharges;
        }
        //delete late payment charge after deposit
        public async Task<LatePaymentChargesReposnseDto> DeleteLatePaymentCharge(int lpcId)
        {
            var latePaymentCharge = await _context.LatePaymentCharges.FindAsync(lpcId);
            if (latePaymentCharge == null)
            {
                return new LatePaymentChargesReposnseDto
                {
                    Success = false,
                    Message = "Late Payment Charge not found"
                };
            }

            _context.LatePaymentCharges.Remove(latePaymentCharge);
            await _context.SaveChangesAsync();

            _context.CashAccounts.RemoveRange(_context.CashAccounts.Where(ca => ca.TransactionId == latePaymentCharge.TransactionId));

            return new LatePaymentChargesReposnseDto
            {
                Success = true,
                Message = "Late Payment Charge deleted successfully"
            };
        }

        //update late payment charge after deposit
        public async Task<LatePaymentChargesReposnseDto> UpdateLatePaymentCharge(int lpcId, decimal depositAmount)
        {
            Guid transactionId = Guid.NewGuid();
            var latePaymentCharge = await _context.LatePaymentCharges.FindAsync(lpcId);
            if (latePaymentCharge == null)
            {
                return new LatePaymentChargesReposnseDto
                {
                    Success = false,
                    Message = "Late Payment Charge not found"
                };
            }

            latePaymentCharge.ChargesDeposit = (latePaymentCharge.ChargesDeposit ?? 0) + depositAmount;
            latePaymentCharge.UpdatedDate = DateTime.Now;

            _context.LatePaymentCharges.Update(latePaymentCharge);
            await _context.SaveChangesAsync();

            var cashAccount = new CashAccount
                    {
                        SGId = latePaymentCharge.SGId,
                        MonthId = latePaymentCharge.MonthId,
                        Particulars = $"Member deposit",
                        CrAmount = 0,
                        DrAmount = depositAmount,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };
                    _context.CashAccounts.Add(cashAccount);

            return new LatePaymentChargesReposnseDto
            {
                Success = true,
                Message = "Late Payment Charge updated successfully"
            };
        }

    }

    
}