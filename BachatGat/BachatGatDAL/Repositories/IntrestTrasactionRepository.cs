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

    public class IntrestTrasactionRepository : IIntrestTrasactionRepository
    {
        private readonly AppDbContext _context;

        public IntrestTrasactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<IntrestPendingDto>> IntrestPending(int SGId)
        {
            var IntrestPendingDtos = await _context.IntrestTrasactions.Include(x => x.Member)
            .Where(x => x.SGId == SGId && x.CurrentIntrestAmount - x.DepositIntrestAmount > 0 && x.Member.IsActive)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
            .Select(g => new IntrestPendingDto
            {
                MemberId = g.Key.MemberId,
                MemberName = g.Key.FullName,
                NoOfMonth = g.Select(x => x.MonthId).Distinct().Count(),
                IntrestPending = g.Sum(x => x.CurrentIntrestAmount)
            })
             .ToListAsync();
            return IntrestPendingDtos;
        }
        public async Task<List<IntrestPendingByMemberDto>> IntrestPendingByMember(int SGId, int MemberId)
        {
            var IntrestPendingDtos = await _context.IntrestTrasactions
            .Include(x => x.Member)
            .Include(x => x.MonthMaster)
            .Where(x => x.SGId == SGId && x.MemberId == MemberId && x.CurrentIntrestAmount - x.DepositIntrestAmount > 0 && x.Member.IsActive)
            .Select(g => new IntrestPendingByMemberDto
            {
                ITId = g.ITId,
                MonthId = g.MonthId,
                MonthName = g.MonthMaster.MonthName,
                IntrestPending = g.CurrentIntrestAmount
            })
             .ToListAsync();
            return IntrestPendingDtos;
        }

        public async Task<IntrestTrasactionResponseDto> UpdateIntrestTrasaction(List<IntrestTrasactionUpdateDto> requests)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var request in requests)
                {
                    var result = await _context.IntrestTrasactions
                        .FirstOrDefaultAsync(x => x.ITId == request.ITId);

                    if (result != null)
                    {
                        Guid transactionId = Guid.NewGuid();

                        // Update interest transaction
                        result.UpdatedDate = DateTime.Now;
                        result.PaymentType = request.PaymentType;
                        result.TrasactionId = transactionId;
                        result.DepositIntrestAmount = request.DepositIntrestAmount;

                        _context.IntrestTrasactions.Update(result);

                        // Add corresponding Cash/Bank entry
                        if (request.PaymentType == (int)PaymentType.Cash)
                        {
                            var cashAccount = new CashAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Interest deposit",
                                CrAmount = 0,
                                DrAmount = request.DepositIntrestAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            };
                            await _context.CashAccounts.AddAsync(cashAccount);
                        }
                        else if (request.PaymentType == (int)PaymentType.Bank)
                        {
                            var bankAccount = new BankAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Interest deposit",
                                CrAmount = 0,
                                DrAmount = request.DepositIntrestAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            };
                            await _context.BankAccounts.AddAsync(bankAccount);
                        }
                    }
                }

                // Save all changes together
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return new IntrestTrasactionResponseDto
                {
                    Success = true,
                    Message = "All transactions processed successfully."
                };
            }
            catch (Exception ex)
            {
                // Rollback if anything fails
                await transaction.RollbackAsync();

                return new IntrestTrasactionResponseDto
                {
                    Success = false,
                    Message = $"Error processing transactions: {ex.Message}"
                };
            }
        }


        /*  public async Task<IntrestTrasactionResponseDto> UpdateIntrestTrasaction(List<IntrestTrasactionUpdateDto> requests)
          {
              using var transaction = await _context.Database.BeginTransactionAsync();
           try
              {
                  foreach (var request in requests)
                  {

              var result=await _context.IntrestTrasactions.Where(x=>x.ITId==request.ITId).FirstOrDefaultAsync();
              if(result!=null)
              {
                  Guid TrasactionId=Guid.NewGuid();
                  result.UpdatedDate=DateTime.Now;
                  result.PaymentType=request.PaymentType;
                  result.TrasactionId=TrasactionId;
                  result.DepositIntrestAmount=request.DepositIntrestAmount;
                  _context.IntrestTrasactions.Update(result);
                  _context.SaveChanges();

                  if (request.PaymentType ==(int) PaymentType.Cash)
                  {
                      var cashAccount = new CashAccount
                      {
                          SGId = result.SGId,
                          MonthId = result.MonthId,
                          Particulars = $"Member Intrest deposit ",
                          CrAmount = 0,
                          DrAmount = request.DepositIntrestAmount,
                          CreatedDate = DateTime.Now,
                          UpdatedDate = DateTime.Now,
                          TransactionId = TrasactionId
                      };
                      _context.CashAccounts.Add(cashAccount);
                  }
                  else if (request.PaymentType == (int)PaymentType.Bank)
                  {
                      var bankAccount = new BankAccount
                      {
                          SGId = result.SGId,
                          MonthId = result.MonthId,
                          Particulars = $"Member Intrest deposit ",
                          CrAmount = 0,
                          DrAmount = request.DepositIntrestAmount,
                          CreatedDate = DateTime.Now,
                          UpdatedDate = DateTime.Now,
                          TransactionId = TrasactionId
                      };
                      _context.BankAccounts.Add(bankAccount);
                  }              



              }
             }



                  var response = new IntrestTrasactionResponseDto()
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
                  var response = new IntrestTrasactionResponseDto()
                  {

                      Success = true,
                      Message = "All Transactions Failed"
                  };
                  return response;
              }
          }*/

    }
}