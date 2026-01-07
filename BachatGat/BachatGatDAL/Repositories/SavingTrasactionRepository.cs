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
        public async Task<SavingTrasactionUpdateResposneDto> PendingDeposit(PendingDepositdto request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                Guid TrasactionId;

                List<CashAccount> cashAccounts = new List<CashAccount>();
                List<BankAccount> bankAccounts = new List<BankAccount>();

                List<SavingTrasaction> savingUpdates = new List<SavingTrasaction>();
                List<IntrestTrasaction> intrestUpdates = new List<IntrestTrasaction>();
                List<LatePaymentCharges> latePaymentUpdates = new List<LatePaymentCharges>();
                // Saving
                foreach (int stid in request.STIds)
                {
                    var result = await _context.SavingTrasactions.FirstOrDefaultAsync(x => x.STId == stid);
                    if (result != null)
                    {
                        TrasactionId = Guid.NewGuid();
                        result.UpdatedDate = DateTime.Now;
                        result.PaymentType = request.PaymentType;
                        result.TrasactionId = TrasactionId;
                        result.DepositSavingAmount = result.CurrentSavingAmount;
                        savingUpdates.Add(result);
                        //_context.SavingTrasactions.Update(result);

                        if (request.PaymentType == (int)PaymentType.Cash)
                        {
                            cashAccounts.Add(new CashAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Saving deposit",
                                CrAmount = 0,
                                DrAmount = result.CurrentSavingAmount ?? 0,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = TrasactionId
                            });
                        }
                        else if (request.PaymentType == (int)PaymentType.Bank)
                        {
                            bankAccounts.Add(new BankAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Saving deposit",
                                CrAmount = 0,
                                DrAmount = result.CurrentSavingAmount ?? 0,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = TrasactionId
                            });
                        }
                    }
                }

                // Interest
                foreach (int itid in request.ITId)
                {
                    var result = await _context.IntrestTrasactions.FirstOrDefaultAsync(x => x.ITId == itid);
                    if (result != null)
                    {
                        TrasactionId = Guid.NewGuid();
                        result.UpdatedDate = DateTime.Now;
                        result.PaymentType = request.PaymentType;
                        result.TrasactionId = TrasactionId;
                        result.DepositIntrestAmount = result.CurrentIntrestAmount;

                        //_context.IntrestTrasactions.Update(result);
                        intrestUpdates.Add(result);

                        if (request.PaymentType == (int)PaymentType.Cash)
                        {
                            cashAccounts.Add(new CashAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Interest deposit",
                                CrAmount = 0,
                                DrAmount = result.CurrentIntrestAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = TrasactionId
                            });
                        }
                        else if (request.PaymentType == (int)PaymentType.Bank)
                        {
                            bankAccounts.Add(new BankAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Interest deposit",
                                CrAmount = 0,
                                DrAmount = result.CurrentIntrestAmount,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = TrasactionId
                            });
                        }
                    }
                }

                // Late Payment Charges
                foreach (int lpcid in request.lpcId)
                {
                    var result = await _context.LatePaymentCharges.FirstOrDefaultAsync(x => x.LPCID == lpcid);
                    if (result != null)
                    {
                        TrasactionId = Guid.NewGuid();
                        result.UpdatedDate = DateTime.Now;
                        result.ChargesDeposit = result.Charges;
                        latePaymentUpdates.Add(result);
                        //_context.LatePaymentCharges.Update(result);

                        if (request.PaymentType == (int)PaymentType.Cash)
                        {
                            cashAccounts.Add(new CashAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Late Payment deposit",
                                CrAmount = 0,
                                DrAmount = result.Charges,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = TrasactionId
                            });
                        }
                        else if (request.PaymentType == (int)PaymentType.Bank)
                        {
                            bankAccounts.Add(new BankAccount
                            {
                                SGId = result.SGId,
                                MonthId = result.MonthId,
                                Particulars = "Member Late Payment deposit",
                                CrAmount = 0,
                                DrAmount = result.Charges,
                                CreatedDate = DateTime.Now,
                                UpdatedDate = DateTime.Now,
                                TransactionId = TrasactionId
                            });
                        }
                    }
                }

                // Loan Repayment
                TrasactionId = Guid.NewGuid();
                var loanid = await _context.LoansAccounts
                    .Where(x => x.SGId == request.SGId && x.MemberId == request.MemberId && x.LoanAmount - x.RepaymentAmount > 0)
                    .Select(x => x.LoanId)
                    .FirstOrDefaultAsync();

                if (loanid > 0)
                {
                    var loanRepayment = new LoanTrasaction
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        MemberId = request.MemberId,
                        LoanId = loanid,
                        PaymentType = request.PaymentType,
                        RepaidLoanAmount = request.EMIAmount,
                        TrasactionId = TrasactionId,
                        Createddate = DateTime.Now,
                        UpdatedDate = DateTime.Now
                    };
                    _context.LoanTrasactions.Add(loanRepayment);

                    if (request.PaymentType == (int)PaymentType.Cash)
                    {
                        cashAccounts.Add(new CashAccount
                        {
                            SGId = request.SGId,
                            MonthId = request.MonthId,
                            Particulars = "Member Loan repayment",
                            CrAmount = 0,
                            DrAmount = request.EMIAmount,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            TransactionId = TrasactionId
                        });
                    }
                    else if (request.PaymentType == (int)PaymentType.Bank)
                    {
                        bankAccounts.Add(new BankAccount
                        {
                            SGId = request.SGId,
                            MonthId = request.MonthId,
                            Particulars = "Member Loan repayment",
                            CrAmount = 0,
                            DrAmount = request.EMIAmount,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            TransactionId = TrasactionId
                        });
                    }
                }

                if (intrestUpdates.Count > 0)
                {
                    _context.IntrestTrasactions.UpdateRange(intrestUpdates);
                }
                if (latePaymentUpdates.Count > 0)
                {
                    _context.LatePaymentCharges.UpdateRange(latePaymentUpdates);
                }
                if (savingUpdates.Count > 0)
                {
                    _context.SavingTrasactions.UpdateRange(savingUpdates);
                }
                if (cashAccounts.Count > 0)
                {
                    _context.CashAccounts.AddRange(cashAccounts);
                }
                if (bankAccounts.Count > 0)
                {
                    _context.BankAccounts.AddRange(bankAccounts);
                }


                // Commit all changes at once
                await _context.SaveChangesAsync();
                // Update LoanAccount repayment amount
                if (loanid > 0)
                {
                    var sumRepayment = await _context.LoanTrasactions
                        .Where(lt => lt.LoanId == loanid)
                        .SumAsync(lt => lt.RepaidLoanAmount);

                    var loanAccount = await _context.LoansAccounts
                        .FirstOrDefaultAsync(la => la.LoanId == loanid);

                    if (loanAccount != null)
                    {
                        loanAccount.RepaymentAmount = sumRepayment;
                        _context.LoansAccounts.Update(loanAccount);
                    }

                    // Save LoanAccount update
                    await _context.SaveChangesAsync();
                }



                await transaction.CommitAsync();

                return new SavingTrasactionUpdateResposneDto
                {
                    Success = true,
                    Message = "All Pending Deposits Processed"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new SavingTrasactionUpdateResposneDto
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }





    }
}