using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace BachatGatDAL.Repositories
{
    public class LoansAccountRepository : ILoansAccountRepository
    {
        private readonly AppDbContext _context;

        public LoansAccountRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<LoanAccountResponseDto>> GetLoanAccounts(int sgId)
        {
            var loanAccounts = await _context.LoansAccounts.Include(x => x.Member)
                .Where(la => la.SGId == sgId && la.LoanAmount - la.RepaymentAmount > 0)
                .Select(la => new LoanAccountResponseDto
                {
                    LoanId = la.LoanId,
                    SGId = la.SGId,
                    MemberId = la.MemberId,
                    MemberName = la.Member.FullName,
                    PaymentType = la.PaymentType,
                    LoanAmount = la.LoanAmount,
                    RepaymentAmount = la.RepaymentAmount,
                    PendingLoanAmount = la.LoanAmount - la.RepaymentAmount,
                    InterestRate = la.InterestRate,
                    TermInMonths = la.TermInMonths,
                    MonthlyInstallment = la.MonthlyInstallment,
                    CreatedDate = la.CreatedDate,
                    UpdatedDate = la.UpdatedDate
                })
                .ToListAsync();

            return loanAccounts;
        }

        public async Task<List<LoanMemberDto>> GetLoanMembers(int sgId)
        {
            List<LoanMemberDto> loanMembersdto = new List<LoanMemberDto>();
         var loanMembers = await _context.Members.Where(m => m.SGId == sgId && m.IsActive== true).ToListAsync();
          foreach(var member in loanMembers)
          {
            var loanAccount = await _context.LoansAccounts
                .Where(la => la.SGId == sgId && la.MemberId == member.MemberId && (la.LoanAmount - la.RepaymentAmount) > 0)
                .FirstOrDefaultAsync();
            if(loanAccount == null)
            {
                loanMembersdto.Add(new LoanMemberDto
                {
                    MemberId = member.MemberId,
                    MemberName = member.FullName
                });
            }
          }
            return loanMembersdto;
        }
        public async Task<UpdateLoanResponseDto> CreateLoanAccount(LoansAccountRequestDto request)
{
    await using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        Guid transactionId = Guid.NewGuid();

        // Create Loan Account
        var requestEntity = new LoansAccount
        {
            SGId = request.SGId,
            MemberId = request.MemberId,
            PaymentType = request.PaymentType,
            TransactionId = transactionId,
            LoanAmount = request.LoanAmount,
            InterestRate = request.InterestRate,
            TermInMonths = request.TermInMonths,
            MonthlyInstallment = request.MonthlyInstallment,
            RepaymentAmount = 0,
            CreatedDate = DateTime.Now,
            UpdatedDate = DateTime.Now,
            IsCompleted = false
        };

        await _context.LoansAccounts.AddAsync(requestEntity);

        // Add Cash/Bank entry
        if (request.PaymentType == (int)PaymentType.Cash)
        {
            var cashAccount = new CashAccount
            {
                SGId = request.SGId,
                MonthId = request.MonthId,
                Particulars = $"Member Loan for {request.MemberName}",
                CrAmount = request.LoanAmount,
                DrAmount = 0,
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
                Particulars = $"Member Loan for {request.MemberName}",
                CrAmount = request.LoanAmount,
                DrAmount = 0,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                TransactionId = transactionId
            };
            await _context.BankAccounts.AddAsync(bankAccount);
        }

        // Save Loan + Cash/Bank together
        await _context.SaveChangesAsync();

        // Update Member’s total loan
        decimal loanAmount = await _context.LoansAccounts
            .Where(x => x.MemberId == request.MemberId && x.LoanAmount - x.RepaymentAmount > 0)
            .SumAsync(x => x.LoanAmount - x.RepaymentAmount);

        var memberEntity = await _context.Members.FirstOrDefaultAsync(m => m.MemberId == request.MemberId);
        if (memberEntity != null)
        {
            memberEntity.TotalLoan = loanAmount;
            _context.Members.Update(memberEntity);
        }

        await _context.SaveChangesAsync();

        // Commit transaction
        await transaction.CommitAsync();

        return new UpdateLoanResponseDto
        {
            LoanId = requestEntity.LoanId,
            Success = true,
            Message = "Loan account created successfully."
        };
    }
    catch (Exception ex)
    {
        // Rollback if anything fails
        await transaction.RollbackAsync();

        return new UpdateLoanResponseDto
        {
            LoanId = 0,
            Success = false,
            Message = $"Error creating loan account: {ex.Message}"
        };
    }
}


      /*  public async Task<UpdateLoanResponseDto> CreateLoanAccount(LoansAccountRequestDto request)
        {
            try
            {
                Guid TransactionId = Guid.NewGuid();
                var requestEntity = new LoansAccount
                {
                    SGId = request.SGId,
                    MemberId = request.MemberId,
                    PaymentType = request.PaymentType,
                    TransactionId = TransactionId,
                    LoanAmount = request.LoanAmount,
                    InterestRate = request.InterestRate,
                    TermInMonths = request.TermInMonths,
                    MonthlyInstallment = request.MonthlyInstallment,
                    RepaymentAmount = 0,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    IsCompleted = false
                };

                await _context.LoansAccounts.AddAsync(requestEntity);
                await _context.SaveChangesAsync();
                if (request.PaymentType == (int)PaymentType.Cash)
                {
                    var cashAccount = new CashAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = $"Member Loan for {request.MemberName}",
                        CrAmount = request.LoanAmount,
                        DrAmount = 0,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = TransactionId
                    };
                    _context.CashAccounts.Add(cashAccount);
                }
                else if (request.PaymentType == (int)PaymentType.Bank)
                {
                    var bankAccount = new BankAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = $"Member Loan for {request.MemberName}",
                        CrAmount = request.LoanAmount,
                        DrAmount = 0,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = TransactionId
                    };
                    _context.BankAccounts.Add(bankAccount);
                }
                await _context.SaveChangesAsync();

               decimal LoanAmount =await _context.LoansAccounts.Where(x=>x.MemberId==request.MemberId && x.LoanAmount-x.RepaymentAmount>0).SumAsync(x=>x.LoanAmount - x.RepaymentAmount);
               var MemberEntity = _context.Members.FirstOrDefault(m => m.MemberId == request.MemberId);
                if (MemberEntity != null)
                {
                    MemberEntity.TotalLoan = LoanAmount;
                    _context.Members.Update(MemberEntity);
                    await _context.SaveChangesAsync();
                }



                var response = new UpdateLoanResponseDto
                {
                    LoanId = requestEntity.LoanId,
                    Success = true,
                    Message = "Loan account created successfully."
                };

                return response;
            }
            catch (Exception ex)
            {
                var response = new UpdateLoanResponseDto
                {
                    LoanId = 0,
                    Success = false,
                    Message = $"Error creating loan account: {ex.Message}"
                };

                return response;
            }
        }*/
      /*  public async Task<UpdateLoanResponseDto> UpdateLoanAccount(LoansAccountRequestDto request)
        {
            var existingLoanAccount = _context.LoansAccounts.FirstOrDefault(la => la.LoanId == request.LoanId);
            if (existingLoanAccount != null)
            {
                var oldPaymentType = existingLoanAccount.PaymentType;
                Guid transactionId = existingLoanAccount.TransactionId;
                existingLoanAccount.PaymentType = request.PaymentType;
                existingLoanAccount.LoanAmount = request.LoanAmount;
                existingLoanAccount.InterestRate = request.InterestRate;
                existingLoanAccount.TermInMonths = request.TermInMonths;
                existingLoanAccount.MonthlyInstallment = request.MonthlyInstallment;
                existingLoanAccount.UpdatedDate = DateTime.Now;
                _context.LoansAccounts.Update(existingLoanAccount);
                await _context.SaveChangesAsync();


                if (oldPaymentType == request.PaymentType)
                {
                    if (request.PaymentType == (int)PaymentType.Cash)
                    {
                        var existingCashAccount = await _context.CashAccounts
                            .FirstOrDefaultAsync(c => c.TransactionId == transactionId);

                        if (existingCashAccount != null)
                        {
                            existingCashAccount.CrAmount = request.LoanAmount;
                            existingCashAccount.UpdatedDate = DateTime.Now;
                            _context.CashAccounts.Update(existingCashAccount);
                        }
                        else
                        {
                            var cashAccount = new CashAccount
                            {
                                SGId = request.SGId,
                                MonthId = request.MonthId,
                                Particulars = $"Member Loan update for {request.MemberName}",
                                CrAmount = request.LoanAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            };
                            _context.CashAccounts.Add(cashAccount);
                        }
                    }
                    else if (request.PaymentType == (int)PaymentType.Bank)
                    {
                        var existingBankAccount = await _context.BankAccounts
                            .FirstOrDefaultAsync(b => b.TransactionId == transactionId);

                        if (existingBankAccount != null)
                        {
                            existingBankAccount.CrAmount = request.LoanAmount;
                            existingBankAccount.UpdatedDate = DateTime.Now;
                            _context.BankAccounts.Update(existingBankAccount);
                        }
                        else
                        {
                            var bankAccount = new BankAccount
                            {
                                SGId = request.SGId,
                                MonthId = request.MonthId,
                                Particulars = $"Member Loan update for {request.MemberName}",
                                CrAmount = request.LoanAmount,
                                DrAmount = 0,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = transactionId
                            };
                            _context.BankAccounts.Add(bankAccount);
                        }
                    }
                }
                else
                {
                    // Delete opposite account type if payment type changed
                    if (oldPaymentType == (int)PaymentType.Bank && request.PaymentType == (int)PaymentType.Cash)
                    {
                        // Delete BankAccount with same TransactionId
                        var bankAccounts = await _context.BankAccounts
                            .Where(b => b.TransactionId == transactionId)
                            .ToListAsync();
                        _context.BankAccounts.RemoveRange(bankAccounts);
                    }
                    else if (oldPaymentType == (int)PaymentType.Cash && request.PaymentType == (int)PaymentType.Bank)
                    {
                        // Delete CashAccount with same TransactionId
                        var cashAccounts = await _context.CashAccounts
                            .Where(c => c.TransactionId == transactionId)
                            .ToListAsync();
                        _context.CashAccounts.RemoveRange(cashAccounts);
                    }
                    await _context.SaveChangesAsync();

                    // Create new account with new PaymentType
                    if (request.PaymentType == (int)PaymentType.Cash)
                    {
                        var cashAccount = new CashAccount
                        {
                            SGId = request.SGId,
                            MonthId = request.MonthId,
                            Particulars = $"Member Loan update for {request.MemberName}",
                            CrAmount = request.LoanAmount,
                            DrAmount = 0,
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
                            Particulars = $"Member Loan update for {request.MemberName}",
                            CrAmount = request.LoanAmount,
                            DrAmount = 0,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            TransactionId = transactionId
                        };
                        _context.BankAccounts.Add(bankAccount);
                    }
                }
               decimal LoanAmount =await _context.LoansAccounts.Where(x=>x.MemberId==request.MemberId && x.LoanAmount-x.RepaymentAmount>0).SumAsync(x=>x.LoanAmount - x.RepaymentAmount);
               var MemberEntity = _context.Members.FirstOrDefault(m => m.MemberId == request.MemberId);
                if (MemberEntity != null)
                {
                    MemberEntity.TotalLoan = LoanAmount;
                    _context.Members.Update(MemberEntity);
                    await _context.SaveChangesAsync();
                }

                var response = new UpdateLoanResponseDto
                {
                    LoanId = existingLoanAccount.LoanId,
                    Success = true,
                    Message = "Loan account updated successfully."
                };
                return response;
            }
            else
            {
                var response = new UpdateLoanResponseDto
                {
                    LoanId = request.LoanId ?? 0,
                    Success = false,
                    Message = "Loan account not found."
                };
                return response;
            }



        }*/
public async Task<UpdateLoanResponseDto> UpdateLoanAccount(LoansAccountRequestDto request)
{
    await using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        var existingLoanAccount = await _context.LoansAccounts
            .FirstOrDefaultAsync(la => la.LoanId == request.LoanId);

        if (existingLoanAccount == null)
        {
            return new UpdateLoanResponseDto
            {
                LoanId = request.LoanId ?? 0,
                Success = false,
                Message = "Loan account not found."
            };
        }

        var oldPaymentType = existingLoanAccount.PaymentType;
        Guid transactionId = existingLoanAccount.TransactionId;

        // Update Loan Account
        existingLoanAccount.PaymentType = request.PaymentType;
        existingLoanAccount.LoanAmount = request.LoanAmount;
        existingLoanAccount.InterestRate = request.InterestRate;
        existingLoanAccount.TermInMonths = request.TermInMonths;
        existingLoanAccount.MonthlyInstallment = request.MonthlyInstallment;
        existingLoanAccount.UpdatedDate = DateTime.Now;

        _context.LoansAccounts.Update(existingLoanAccount);

        // Handle Cash/Bank updates
        if (oldPaymentType == request.PaymentType)
        {
            if (request.PaymentType == (int)PaymentType.Cash)
            {
                var existingCashAccount = await _context.CashAccounts
                    .FirstOrDefaultAsync(c => c.TransactionId == transactionId);

                if (existingCashAccount != null)
                {
                    existingCashAccount.CrAmount = request.LoanAmount;
                    existingCashAccount.UpdatedDate = DateTime.Now;
                    _context.CashAccounts.Update(existingCashAccount);
                }
                else
                {
                    var cashAccount = new CashAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = $"Member Loan update for {request.MemberName}",
                        CrAmount = request.LoanAmount,
                        DrAmount = 0,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };
                    await _context.CashAccounts.AddAsync(cashAccount);
                }
            }
            else if (request.PaymentType == (int)PaymentType.Bank)
            {
                var existingBankAccount = await _context.BankAccounts
                    .FirstOrDefaultAsync(b => b.TransactionId == transactionId);

                if (existingBankAccount != null)
                {
                    existingBankAccount.CrAmount = request.LoanAmount;
                    existingBankAccount.UpdatedDate = DateTime.Now;
                    _context.BankAccounts.Update(existingBankAccount);
                }
                else
                {
                    var bankAccount = new BankAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = $"Member Loan update for {request.MemberName}",
                        CrAmount = request.LoanAmount,
                        DrAmount = 0,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };
                    await _context.BankAccounts.AddAsync(bankAccount);
                }
            }
        }
        else
        {
            // Delete opposite account type if payment type changed
            if (oldPaymentType == (int)PaymentType.Bank && request.PaymentType == (int)PaymentType.Cash)
            {
                var bankAccounts = await _context.BankAccounts
                    .Where(b => b.TransactionId == transactionId)
                    .ToListAsync();
                _context.BankAccounts.RemoveRange(bankAccounts);
            }
            else if (oldPaymentType == (int)PaymentType.Cash && request.PaymentType == (int)PaymentType.Bank)
            {
                var cashAccounts = await _context.CashAccounts
                    .Where(c => c.TransactionId == transactionId)
                    .ToListAsync();
                _context.CashAccounts.RemoveRange(cashAccounts);
            }

            // Create new account with new PaymentType
            if (request.PaymentType == (int)PaymentType.Cash)
            {
                var cashAccount = new CashAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    Particulars = $"Member Loan update for {request.MemberName}",
                    CrAmount = request.LoanAmount,
                    DrAmount = 0,
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
                    Particulars = $"Member Loan update for {request.MemberName}",
                    CrAmount = request.LoanAmount,
                    DrAmount = 0,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    TransactionId = transactionId
                };
                await _context.BankAccounts.AddAsync(bankAccount);
            }
        }

        // Update Member’s total loan
        decimal loanAmount = await _context.LoansAccounts
            .Where(x => x.MemberId == request.MemberId && x.LoanAmount - x.RepaymentAmount > 0)
            .SumAsync(x => x.LoanAmount - x.RepaymentAmount);

        var memberEntity = await _context.Members
            .FirstOrDefaultAsync(m => m.MemberId == request.MemberId);

        if (memberEntity != null)
        {
            memberEntity.TotalLoan = loanAmount;
            _context.Members.Update(memberEntity);
        }

        // Save all changes together
        await _context.SaveChangesAsync();

        // Commit transaction
        await transaction.CommitAsync();

        return new UpdateLoanResponseDto
        {
            LoanId = existingLoanAccount.LoanId,
            Success = true,
            Message = "Loan account updated successfully."
        };
    }
    catch (Exception ex)
    {
        // Rollback if anything fails
        await transaction.RollbackAsync();

        return new UpdateLoanResponseDto
        {
            LoanId = request.LoanId ?? 0,
            Success = false,
            Message = $"Error updating loan account: {ex.Message}"
        };
    }
}



    }
}