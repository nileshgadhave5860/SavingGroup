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
            try{
            Guid TransactionId = Guid.NewGuid();
            if(request.IncomeExpensesType==1) // Income
            {
                var income = new IncomeExpensesAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                     Income=request.Amount,
                      PaymentType=request.PaymentType,
                    Particulars = request.Particulars,
                     Expenses=0,
                    TransactionId =TransactionId,              
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };
              await  _context.IncomeExpensesAccounts.AddAsync(income);
            }
            else if(request.IncomeExpensesType==2) 
            {              
               var expense = new IncomeExpensesAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                     Income=request.Amount,
                      PaymentType=request.PaymentType,
                    Particulars = request.Particulars,
                     Expenses=0,
                    TransactionId =TransactionId,              
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                };
              await  _context.IncomeExpensesAccounts.AddAsync(expense);
            }
            await _context.SaveChangesAsync();
             if (request.PaymentType ==(int) PaymentType.Cash)
                {
                    CashAccount Account = new CashAccount();
                    
                        Account.SGId = request.SGId;
                        Account.MonthId = request.MonthId;
                        if(request.IncomeExpensesType==1)
                        {
                            Account.Particulars = $" income for {request.Particulars}";
                            Account.CrAmount = 0;
                            Account.DrAmount = request.Amount;
                        }
                        else if(request.IncomeExpensesType==2)
                        {
                            Account.Particulars = $" expense for {request.Particulars}";
                            Account.CrAmount = request.Amount;
                            Account.DrAmount = 0;
                        }
                        
                        Account.CreatedDate = DateTime.Now;
                        Account.UpdatedDate = DateTime.Now;
                        Account.TransactionId = TransactionId;
                    
                    _context.CashAccounts.Add(Account);
                }
                else if (request.PaymentType ==(int) PaymentType.Bank)
                {
                   
                    BankAccount Account = new BankAccount();                    
                        Account.SGId = request.SGId;
                        Account.MonthId = request.MonthId;
                        if(request.IncomeExpensesType==1)
                        {
                            Account.Particulars = $" income for {request.Particulars}";
                            Account.CrAmount = 0;
                            Account.DrAmount = request.Amount;
                        }
                        else if(request.IncomeExpensesType==2)
                        {
                            Account.Particulars = $" expense for {request.Particulars}";
                            Account.CrAmount = request.Amount;
                            Account.DrAmount = 0;
                        }
                        Account.CreatedDate = DateTime.Now;
                        Account.UpdatedDate = DateTime.Now;
                        Account.TransactionId = TransactionId;                   
                    _context.BankAccounts.Add(Account);
                }

                await _context.SaveChangesAsync();
 

            return new IncomeExpensesResponseDto
            {
                Success = true,
                Message = "Income/Expense recorded successfully."
            };
            }
            catch(Exception ex)
            {
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
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                return new List<IncomeExpensesAccountDto>();
            }
        }

        public async Task<IncomeExpensesResponseDto> DeleteIncomeExpense(int IEId)
        {
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

                _context.IncomeExpensesAccounts.Remove(record);
                await _context.SaveChangesAsync();

                return new IncomeExpensesResponseDto
                {
                    Success = true,
                    Message = "Record deleted successfully."
                };
            }
            catch (Exception ex)
            {
                return new IncomeExpensesResponseDto
                {
                    Success = false,
                    Message = $"Error deleting record: {ex.Message}"
                };
            }
        }


        // Implement methods for income and expenses management here
    }
}