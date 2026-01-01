using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Linq;

namespace BachatGatDAL.Repositories
{
    public class IncomeExpensesRepository : IIncomeExpensesRepository
    {
        private readonly AppDbContext _context;

        public IncomeExpensesRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IncomeExpensesResponseDto> IncomeExpenseCreate(IncomeExpensesRequestDto request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                Guid transactionId = Guid.NewGuid();

                // Income or Expense entry
                var incomeExpense = new IncomeExpensesAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    Income = request.IncomeExpensesType == 1 ? request.Amount : 0,
                    Expenses = request.IncomeExpensesType == 2 ? request.Amount : 0,
                    PaymentType = request.PaymentType,
                    Particulars = request.Particulars,
                    TransactionId = transactionId,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };

                await _context.IncomeExpensesAccounts.AddAsync(incomeExpense);

                // Cash or Bank entry
                if (request.PaymentType == (int)PaymentType.Cash)
                {
                    var cashAccount = new CashAccount
                    {
                        SGId = request.SGId,
                        MonthId = request.MonthId,
                        Particulars = request.IncomeExpensesType == 1
                            ? $" income for {request.Particulars}"
                            : $" expense for {request.Particulars}",
                        CrAmount = request.IncomeExpensesType == 2 ? request.Amount : 0,
                        DrAmount = request.IncomeExpensesType == 1 ? request.Amount : 0,
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
                        Particulars = request.IncomeExpensesType == 1
                            ? $" income for {request.Particulars}"
                            : $" expense for {request.Particulars}",
                        CrAmount = request.IncomeExpensesType == 2 ? request.Amount : 0,
                        DrAmount = request.IncomeExpensesType == 1 ? request.Amount : 0,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        TransactionId = transactionId
                    };

                    await _context.BankAccounts.AddAsync(bankAccount);
                }

                // Save all changes together
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                return new IncomeExpensesResponseDto
                {
                    Success = true,
                    Message = "Income/Expense recorded successfully."
                };
            }
            catch (Exception ex)
            {
                // Rollback if anything fails
                await transaction.RollbackAsync();

                return new IncomeExpensesResponseDto
                {
                    Success = false,
                    Message = $"Error recording Income/Expense: {ex.Message}"
                };
            }
        }

        public async Task<List<IncomeExpensesAccountDto>> GetIncomeExpensesBySGId(int SGId)
        {
            try
            {
                var records = await _context.IncomeExpensesAccounts
                    .Where(ie => ie.SGId == SGId)
                    .Select(ie => new IncomeExpensesAccountDto
                    {
                        IEId = ie.IEId,
                        SGId = ie.SGId,
                        MonthId = ie.MonthId,
                        Particulars = ie.Particulars,
                        PaymentType = ie.PaymentType,
                        Income = ie.Income,
                        Expenses = ie.Expenses,
                        CreatedDate = ie.CreatedDate,
                        UpdatedDate = ie.UpdatedDate
                    }).ToListAsync();
                return records;


            }
            catch (Exception)
            {
                // Log the exception (not implemented here)
                return new List<IncomeExpensesAccountDto>();
            }
        }

        public async Task<IncomeExpensesResponseDto> DeleteIncomeExpense(int IEId)
{
    await using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        var record = await _context.IncomeExpensesAccounts.FindAsync(IEId);
        if (record == null)
        {
            return new IncomeExpensesResponseDto
            {
                Success = false,
                Message = "Record not found."
            };
        }

        // Remove Income/Expense record
        _context.IncomeExpensesAccounts.Remove(record);

        // Remove linked CashAccount if exists
        var cashAccountEntity = await _context.CashAccounts
            .FirstOrDefaultAsync(ca => ca.TransactionId == record.TransactionId);
        if (cashAccountEntity != null)
        {
            _context.CashAccounts.Remove(cashAccountEntity);
        }

        // Remove linked BankAccount if exists
        var bankAccountEntity = await _context.BankAccounts
            .FirstOrDefaultAsync(ba => ba.TransactionId == record.TransactionId);
        if (bankAccountEntity != null)
        {
            _context.BankAccounts.Remove(bankAccountEntity);
        }

        // Save all deletions together
        await _context.SaveChangesAsync();

        // Commit transaction
        await transaction.CommitAsync();

        return new IncomeExpensesResponseDto
        {
            Success = true,
            Message = "Record deleted successfully."
        };
    }
    catch (Exception ex)
    {
        // Rollback if anything fails
        await transaction.RollbackAsync();

        return new IncomeExpensesResponseDto
        {
            Success = false,
            Message = $"Error deleting record: {ex.Message}"
        };
    }
}


public async Task<IncomeExpensesResponseDto> UpdateIncomeExpense(UpdateIncomeExpensesDto request)
{
    await using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        var record = await _context.IncomeExpensesAccounts.FindAsync(request.IEId);
        if (record == null)
        {
            return new IncomeExpensesResponseDto
            {
                Success = false,
                Message = "Record not found."
            };
        }

        // Update Income/Expense record
        record.Particulars = request.Particulars;
        if (request.IncomeExpensesType == 1) // Income
        {
            record.Income = request.Amount;
            record.Expenses = 0;
        }
        else if (request.IncomeExpensesType == 2) // Expense
        {
            record.Income = 0;
            record.Expenses = request.Amount;
        }
        record.UpdatedDate = DateTime.Now;

        _context.IncomeExpensesAccounts.Update(record);

        // Remove old Cash/Bank entries
        var cashAccountEntity = await _context.CashAccounts
            .FirstOrDefaultAsync(ca => ca.TransactionId == record.TransactionId);
        if (cashAccountEntity != null)
        {
            _context.CashAccounts.Remove(cashAccountEntity);
        }

        var bankAccountEntity = await _context.BankAccounts
            .FirstOrDefaultAsync(ba => ba.TransactionId == record.TransactionId);
        if (bankAccountEntity != null)
        {
            _context.BankAccounts.Remove(bankAccountEntity);
        }

        // Add updated Cash/Bank entry
        if (record.PaymentType == (int)PaymentType.Cash)
        {
            var cashAccount = new CashAccount
            {
                SGId = record.SGId,
                MonthId = record.MonthId,
                Particulars = request.IncomeExpensesType == 1
                    ? $" income for {request.Particulars}"
                    : $" expense for {request.Particulars}",
                CrAmount = request.IncomeExpensesType == 2 ? request.Amount : 0,
                DrAmount = request.IncomeExpensesType == 1 ? request.Amount : 0,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                TransactionId = record.TransactionId
            };

            await _context.CashAccounts.AddAsync(cashAccount);
        }
        else if (record.PaymentType == (int)PaymentType.Bank)
        {
            var bankAccount = new BankAccount
            {
                SGId = record.SGId,
                MonthId = record.MonthId,
                Particulars = request.IncomeExpensesType == 1
                    ? $" income for {request.Particulars}"
                    : $" expense for {request.Particulars}",
                CrAmount = request.IncomeExpensesType == 2 ? request.Amount : 0,
                DrAmount = request.IncomeExpensesType == 1 ? request.Amount : 0,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                TransactionId = record.TransactionId
            };

            await _context.BankAccounts.AddAsync(bankAccount);
        }

        // Save all changes together
        await _context.SaveChangesAsync();

        // Commit transaction
        await transaction.CommitAsync();

        return new IncomeExpensesResponseDto
        {
            Success = true,
            Message = "Income/Expense updated successfully."
        };
    }
    catch (Exception ex)
    {
        // Rollback if anything fails
        await transaction.RollbackAsync();

        return new IncomeExpensesResponseDto
        {
            Success = false,
            Message = $"Error updating record: {ex.Message}"
        };
    }
}


        // Implement methods for income and expenses management here
    }
}