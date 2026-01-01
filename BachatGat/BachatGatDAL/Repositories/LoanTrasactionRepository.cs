using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;

namespace BachatGatDAL.Repositories
{
    public class LoanTrasactionRepository : ILoanTrasactionRepository
    {
        private readonly AppDbContext _context;

        public LoanTrasactionRepository(AppDbContext context)
        {
            _context = context;
        }

        /*   public async Task<LoanTrasactionResponseDto> CreateLoanTrasaction(CreateLoanTrasactionDto request)
           {
               try
               {
                   var transactionId = Guid.NewGuid();

                   var loanTrasaction = new LoanTrasaction
                   {
                       SGId = request.SGId,
                       MonthId = request.MonthId,
                       MemberId = request.MemberId,
                       LoanId = request.LoanId,
                       PaymentType = request.PaymentType,
                       RepaidLoanAmount = request.RepaidLoanAmount,
                       TrasactionId = transactionId,
                       Createddate = DateTime.Now,
                       UpdatedDate = DateTime.Now
                   };

                   _context.Set<LoanTrasaction>().Add(loanTrasaction);
                   await _context.SaveChangesAsync();

                   if (request.PaymentType == (int)PaymentType.Cash)
                   {
                       var cashAccount = new CashAccount
                       {
                           SGId = request.SGId,
                           MonthId = request.MonthId,
                           Particulars = $"Loan repayment ",
                           CrAmount = 0,
                           DrAmount = request.RepaidLoanAmount,
                           CreatedDate = DateTime.Now,
                           UpdatedDate = DateTime.Now,
                           TransactionId = transactionId
                       };
                       _context.CashAccounts.Add(cashAccount);
                   }
                   else if (request.PaymentType == (int)PaymentType.Bank)
                   {
                       var bankAccount = new BankAccount
                       {
                           SGId = request.SGId,
                           MonthId = request.MonthId,
                           Particulars = $"Loan repayment ",
                           CrAmount = 0,
                           DrAmount = request.RepaidLoanAmount,
                           CreatedDate = DateTime.Now,
                           UpdatedDate = DateTime.Now,
                           TransactionId = transactionId
                       };
                       _context.BankAccounts.Add(bankAccount);
                   }

                   await _context.SaveChangesAsync();

                   var sumRepayment = await _context.LoanTrasactions
                       .Where(lt => lt.LoanId == request.LoanId)
                       .SumAsync(lt => lt.RepaidLoanAmount);

                   var loanAccount = await _context.LoansAccounts
                   .FirstOrDefaultAsync(la => la.LoanId == request.LoanId);
                   if (loanAccount != null)
                   {
                       loanAccount.RepaymentAmount = sumRepayment;
                       _context.LoansAccounts.Update(loanAccount);
                       await _context.SaveChangesAsync();
                   }

                   return new LoanTrasactionResponseDto
                   {
                       Success = true,
                       Message = "Loan transaction created successfully",
                       LTId = loanTrasaction.LTId
                   };
               }
               catch (Exception ex)
               {
                   return new LoanTrasactionResponseDto
                   {
                       Success = false,
                       Message = $"Error creating loan transaction: {ex.Message}",
                       LTId = 0
                   };
               }
           }*/

        public async Task<LoanTrasactionResponseDto> CreateLoanTrasaction(CreateLoanTrasactionDto request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var transactionId = Guid.NewGuid();

                // Create Loan Transaction
                var loanTrasaction = new LoanTrasaction
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    MemberId = request.MemberId,
                    LoanId = request.LoanId,
                    PaymentType = request.PaymentType,
                    RepaidLoanAmount = request.RepaidLoanAmount,
                    TrasactionId = transactionId,
                    Createddate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };

                await _context.Set<LoanTrasaction>().AddAsync(loanTrasaction);

                // Add Cash/Bank entry
                if (request.PaymentType == (int)PaymentType.Cash)
                {
                    var cashAccount = new CashAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = "Loan repayment",
                        CrAmount = 0,
                        DrAmount = request.RepaidLoanAmount,
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
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = "Loan repayment",
                        CrAmount = 0,
                        DrAmount = request.RepaidLoanAmount,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };
                    await _context.BankAccounts.AddAsync(bankAccount);
                }

                // Save LoanTrasaction + Cash/Bank together
                await _context.SaveChangesAsync();

                // Update LoanAccount repayment amount
                var sumRepayment = await _context.LoanTrasactions
                    .Where(lt => lt.LoanId == request.LoanId)
                    .SumAsync(lt => lt.RepaidLoanAmount);

                var loanAccount = await _context.LoansAccounts
                    .FirstOrDefaultAsync(la => la.LoanId == request.LoanId);

                if (loanAccount != null)
                {
                    loanAccount.RepaymentAmount = sumRepayment;
                    _context.LoansAccounts.Update(loanAccount);
                }

                // Save LoanAccount update
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return new LoanTrasactionResponseDto
                {
                    Success = true,
                    Message = "Loan transaction created successfully",
                    LTId = loanTrasaction.LTId
                };
            }
            catch (Exception ex)
            {
                // Rollback if anything fails
                await transaction.RollbackAsync();

                return new LoanTrasactionResponseDto
                {
                    Success = false,
                    Message = $"Error creating loan transaction: {ex.Message}",
                    LTId = 0
                };
            }
        }

        public async Task<LoanTrasactionResponseDto> UpdateLoanTrasaction(UpdateLoanTrasactionDto request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var loanTrasaction = await _context.Set<LoanTrasaction>()
                    .FirstOrDefaultAsync(lt => lt.LTId == request.LTId);

                if (loanTrasaction == null)
                {
                    return new LoanTrasactionResponseDto
                    {
                        Success = false,
                        Message = "Loan transaction not found",
                        LTId = 0
                    };
                }

                // Update Loan Transaction
                loanTrasaction.SGId = request.SGId;
                loanTrasaction.MonthId = request.MonthId;
                loanTrasaction.MemberId = request.MemberId;
                loanTrasaction.LoanId = request.LoanId;
                loanTrasaction.PaymentType = request.PaymentType;
                loanTrasaction.RepaidLoanAmount = request.RepaidLoanAmount;
                loanTrasaction.UpdatedDate = DateTime.Now;

                _context.LoanTrasactions.Update(loanTrasaction);

                // If you want to also update linked Cash/Bank accounts in future:
                // var cashAccount = await _context.CashAccounts
                //     .FirstOrDefaultAsync(c => c.TransactionId == loanTrasaction.TrasactionId);
                // var bankAccount = await _context.BankAccounts
                //     .FirstOrDefaultAsync(b => b.TransactionId == loanTrasaction.TrasactionId);
                // (Update or recreate them here as needed)

                // Save all changes together
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return new LoanTrasactionResponseDto
                {
                    Success = true,
                    Message = "Loan transaction updated successfully",
                    LTId = loanTrasaction.LTId
                };
            }
            catch (Exception ex)
            {
                // Rollback if anything fails
                await transaction.RollbackAsync();

                return new LoanTrasactionResponseDto
                {
                    Success = false,
                    Message = $"Error updating loan transaction: {ex.Message}",
                    LTId = 0
                };
            }
        }

        /*public async Task<LoanTrasactionResponseDto> UpdateLoanTrasaction(UpdateLoanTrasactionDto request)
        {
            try
            {
                var loanTrasaction = await _context.Set<LoanTrasaction>()
                    .FirstOrDefaultAsync(lt => lt.LTId == request.LTId);

                if (loanTrasaction == null)
                {
                    return new LoanTrasactionResponseDto
                    {
                        Success = false,
                        Message = "Loan transaction not found",
                        LTId = 0
                    };
                }

                loanTrasaction.SGId = request.SGId;
                loanTrasaction.MonthId = request.MonthId;
                loanTrasaction.MemberId = request.MemberId;
                loanTrasaction.LoanId = request.LoanId;
                loanTrasaction.PaymentType = request.PaymentType;
                loanTrasaction.RepaidLoanAmount = request.RepaidLoanAmount;
                loanTrasaction.UpdatedDate = DateTime.Now;

                _context.Set<LoanTrasaction>().Update(loanTrasaction);
                await _context.SaveChangesAsync();

                return new LoanTrasactionResponseDto
                {
                    Success = true,
                    Message = "Loan transaction updated successfully",
                    LTId = loanTrasaction.LTId
                };
            }
            catch (Exception ex)
            {
                return new LoanTrasactionResponseDto
                {
                    Success = false,
                    Message = $"Error updating loan transaction: {ex.Message}",
                    LTId = 0
                };
            }
        }
*/
        /*  public async Task<DeleteLoanTrasactionResponseDto> DeleteLoanTrasaction(int ltId)
          {
              try
              {
                  var loanTrasaction = await _context.Set<LoanTrasaction>()
                      .FirstOrDefaultAsync(lt => lt.LTId == ltId);

                  if (loanTrasaction == null)
                  {
                      return new DeleteLoanTrasactionResponseDto
                      {
                          Success = false,
                          Message = "Loan transaction not found"
                      };
                  }

                  _context.Set<LoanTrasaction>().Remove(loanTrasaction);
                  await _context.SaveChangesAsync();

                  return new DeleteLoanTrasactionResponseDto
                  {
                      Success = true,
                      Message = "Loan transaction deleted successfully"
                  };
              }
              catch (Exception ex)
              {
                  return new DeleteLoanTrasactionResponseDto
                  {
                      Success = false,
                      Message = $"Error deleting loan transaction: {ex.Message}"
                  };
              }
          }*/

        public async Task<DeleteLoanTrasactionResponseDto> DeleteLoanTrasaction(int ltId)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var loanTrasaction = await _context.Set<LoanTrasaction>()
                    .FirstOrDefaultAsync(lt => lt.LTId == ltId);

                if (loanTrasaction == null)
                {
                    return new DeleteLoanTrasactionResponseDto
                    {
                        Success = false,
                        Message = "Loan transaction not found"
                    };
                }

                // Remove Loan Transaction
                _context.Set<LoanTrasaction>().Remove(loanTrasaction);

                // Remove related Cash and Bank Account entries
                _context.CashAccounts.RemoveRange(
                    await _context.CashAccounts.Where(c => c.TransactionId == loanTrasaction.TrasactionId).ToListAsync()
                );

                _context.BankAccounts.RemoveRange(
                    await _context.BankAccounts.Where(b => b.TransactionId == loanTrasaction.TrasactionId).ToListAsync()
                );

                // Save all deletions together
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return new DeleteLoanTrasactionResponseDto
                {
                    Success = true,
                    Message = "Loan transaction deleted successfully"
                };
            }
            catch (Exception ex)
            {
                // Rollback if anything fails
                await transaction.RollbackAsync();

                return new DeleteLoanTrasactionResponseDto
                {
                    Success = false,
                    Message = $"Error deleting loan transaction: {ex.Message}"
                };
            }
        }

        public async Task<GetLoanTrasactionByLoanIdResponseDto> GetLoanTrasactionByLoanId(int loanId)
        {
            try
            {
                var loanTrasactions = await _context.Set<LoanTrasaction>()
                    .Include(lt => lt.Member)
                    .Where(lt => lt.LoanId == loanId)
                    .Select(lt => new LoanTrasactionDetailDto
                    {
                        LTId = lt.LTId,
                        SGId = lt.SGId,
                        MonthId = lt.MonthId,
                        MemberId = lt.MemberId,
                        MemberName = lt.Member.FullName,
                        LoanId = lt.LoanId,
                        PaymentType = lt.PaymentType,
                        RepaidLoanAmount = lt.RepaidLoanAmount,
                        TrasactionId = lt.TrasactionId,
                        UpdatedDate = lt.UpdatedDate,
                        Createddate = lt.Createddate
                    })
                    .ToListAsync();

                return new GetLoanTrasactionByLoanIdResponseDto
                {
                    Success = true,
                    Message = "Loan transactions retrieved successfully",
                    LoanTrasactions = loanTrasactions
                };
            }
            catch (Exception ex)
            {
                return new GetLoanTrasactionByLoanIdResponseDto
                {
                    Success = false,
                    Message = $"Error retrieving loan transactions: {ex.Message}",
                    LoanTrasactions = new List<LoanTrasactionDetailDto>()
                };
            }
        }
    }
}
