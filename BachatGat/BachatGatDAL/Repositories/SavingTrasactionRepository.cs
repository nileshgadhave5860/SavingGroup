using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace BachatGatDAL.Repositories
{

    public class SavingTrasactionRepository : ISavingTrasactionRepository
    {
        private readonly AppDbContext _context;

        public SavingTrasactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SavingPendingDto>> SavingPending(int SGId)
        {

            var savingPendingDtos = await _context.SavingTrasactions.Include(x => x.Member)
            .Where(x => x.SGId == SGId && (x.CurrentSavingAmount ?? 0) - (x.DepositSavingAmount ?? 0) > 0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
            .Select(g => new SavingPendingDto
            {
                MemberId = g.Key.MemberId,
                MemberName = g.Key.FullName,
                NoOfMonth = g.Select(x => x.MonthId).Distinct().Count(),
                SavingPending = g.Sum(x => x.CurrentSavingAmount) ?? 0
            }
             )
             .ToListAsync();
            return savingPendingDtos;

        }
        public async Task<List<SavingPendingByMemberDto>> SavingPendingByMember(int SGId, int MemberId)
        {
            var savingPendingDtos = await _context.SavingTrasactions
            .Include(x => x.Member)
            .Include(x => x.MonthMaster)
            .Where(x => x.SGId == SGId && x.MemberId == MemberId && (x.CurrentSavingAmount ?? 0) - (x.DepositSavingAmount ?? 0) > 0)
            .Select(g => new SavingPendingByMemberDto
            {
                STId = g.STId,
                MonthName = g.MonthMaster.MonthName,
                SavingPending = g.CurrentSavingAmount ?? 0
            })
             .ToListAsync();
            return savingPendingDtos;
        }

        public async Task<SavingTrasactionUpdateResposneDto> UpdateSavingTrasactionAsync(List<SavingTrasactionUpdateDto> requests)
        {


            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var request in requests)
                {
                    var result = await _context.SavingTrasactions
                                               .FirstOrDefaultAsync(x => x.STId == request.STId);

                    if (result != null)
                    {
                        Guid transactionId = Guid.NewGuid();
                        result.UpdatedDate = DateTime.Now;
                        result.PaymentType = request.PaymentType;
                        result.TrasactionId = transactionId;
                        result.DepositSavingAmount = request.DepositSavingAmount;

                        _context.SavingTrasactions.Update(result);

                        if (request.PaymentType == (int)PaymentType.Cash)
                        {
                            _context.CashAccounts.Add(new CashAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Saving deposit",
                                CrAmount = 0,
                                DrAmount = request.DepositSavingAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            });
                        }
                        else if (request.PaymentType == (int)PaymentType.Bank)
                        {
                            _context.BankAccounts.Add(new BankAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Saving deposit",
                                CrAmount = 0,
                                DrAmount = request.DepositSavingAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            });
                        }


                    }




                }

                

                var response = new SavingTrasactionUpdateResposneDto()
                {

                    Success = true,
                    Message = "All Transactions Processed"
                };

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return response;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Optionally log ex
                var response = new SavingTrasactionUpdateResposneDto()
                {

                    Success = true,
                    Message = "All Transactions Failed"
                };
                return response;
            }


        }


        /* public async Task<SavingTrasactionResponseDto> UpdateSavingTrasaction(List<SavingTrasactionUpdateDto> Listreqest)
         {
             foreach(var reqest in Listreqest)
             {


             var result=await _context.SavingTrasactions.Where(x=>x.STId==reqest.STId).FirstOrDefaultAsync();
             if(result!=null)
             {
                 Guid TrasactionId=Guid.NewGuid();
                 result.UpdatedDate=DateTime.Now;
                 result.PaymentType=reqest.PaymentType;
                 result.TrasactionId=TrasactionId;
                 result.DepositSavingAmount=reqest.DepositSavingAmount;
                 _context.SavingTrasactions.Update(result);
                 _context.SaveChanges();

                 if (reqest.PaymentType ==(int) PaymentType.Cash)
                 {
                     var cashAccount = new CashAccount
                     {
                         SGId = result.SGId,
                         MonthId = result.MonthId,
                         Particulars = $"Member Saving deposit ",
                         CrAmount = 0,
                         DrAmount = reqest.DepositSavingAmount,
                         CreatedDate = DateTime.Now,
                         UpdatedDate = DateTime.Now,
                         TransactionId = TrasactionId
                     };
                     _context.CashAccounts.Add(cashAccount);
                 }
                 else if (reqest.PaymentType == (int)PaymentType.Bank)
                 {
                     var bankAccount = new BankAccount
                     {
                         SGId = result.SGId,
                         MonthId = result.MonthId,
                         Particulars = $"Member Saving deposit ",
                         CrAmount = 0,
                         DrAmount = reqest.DepositSavingAmount,
                         CreatedDate = DateTime.Now,
                         UpdatedDate = DateTime.Now,
                         TransactionId = TrasactionId
                     };
                     _context.BankAccounts.Add(bankAccount);
                 }

                 await _context.SaveChangesAsync();
                  return new SavingTrasactionResponseDto
                  {
                       STID=reqest.STId,
                        Success=true,
                         TransactionId=TrasactionId,
                          Message="Updated Sucessfull"
                  };

             }
             else
             {
                 return new SavingTrasactionResponseDto
                  {
                       STID=reqest.STId,
                        Success=false,
                         TransactionId=null,
                          Message="Updated Failes"
                  };

               }
             }
         }*/

    }
}