using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Linq;

namespace BachatGatDAL.Repositories
{
    public class BankRepository : IBankRepository
    {
        private readonly AppDbContext _context;

        public BankRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<BankResponseDto> CashDeposit(BankRequestDto request)
        {
            try
            {
                var transactionId = Guid.NewGuid();

                var bankAccount = new BankAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    Particulars = "Bank Deposit",
                    CrAmount = 0,
                    DrAmount = request.Amount,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    TransactionId = transactionId
                };
                _context.BankAccounts.Add(bankAccount);
                await _context.SaveChangesAsync();
                var CashAccount = new CashAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    Particulars = "Bank Deposit",
                    CrAmount = request.Amount,
                    DrAmount = 0,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    TransactionId = transactionId
                };
_context.CashAccounts.Add(CashAccount);
                await _context.SaveChangesAsync();
                return new BankResponseDto
                {
                    Success = true,
                    Message = "Bank transaction recorded successfully."
                };
            }
            catch (Exception ex)
            {
                return new BankResponseDto
                {
                    Success = false,
                    Message = $"Error recording bank transaction: {ex.Message}"
                };
            }

        }
        // cash withdraw
        public async Task<BankResponseDto> CashWithdraw(BankRequestDto request) 
        {
            try
            {
                var transactionId = Guid.NewGuid();

                var bankAccount = new BankAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    Particulars = "Bank Withdraw",
                    CrAmount = request.Amount,
                    DrAmount = 0,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    TransactionId = transactionId
                };
                _context.BankAccounts.Add(bankAccount);
                await _context.SaveChangesAsync();
                var CashAccount = new CashAccount
                {
                    SGId = request.SGId,
                    MonthId = request.MonthId,
                    Particulars = "Bank Withdraw",
                    CrAmount = 0,
                    DrAmount = request.Amount,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    TransactionId = transactionId
                };
                _context.CashAccounts.Add(CashAccount);
                await _context.SaveChangesAsync();
                return new BankResponseDto
                {
                    Success = true,
                    Message = "Bank withdraw transaction recorded successfully."
                };
            }
            catch (Exception ex)
            {
                return new BankResponseDto
                {
                    Success = false,
                    Message = $"Error recording bank withdraw transaction: {ex.Message}"
                };
            }

        }
    }
}