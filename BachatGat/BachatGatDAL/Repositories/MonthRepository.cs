using BachatGatDAL.Data;
using BachatGatDAL.Entities;
using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.EntityFrameworkCore;

namespace BachatGatDAL.Repositories
{
    public class MonthRepository : IMonthRepository
    {
        private readonly AppDbContext _context;

        public MonthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CreateMonthResponseDto> CreateMonth(CreateMonthDto request)
        {
            try
            {

               bool CheckExist=_context.MonthMasters.Any(m => m.SGId == request.SGId && m.MonthNo == request.newMonthNo && m.YearNo == request.newYearNo);
               if(!CheckExist)
                {
                // Get the last month for the saving group
                var lastMonth = await _context.MonthMasters
                    .Where(m => m.SGId == request.SGId)
                    .OrderByDescending(m => m.YearNo)
                    .ThenByDescending(m => m.MonthNo)
                    .FirstOrDefaultAsync();
                
                
               // string newMonthName;
 
               /* if (lastMonth == null)
                {
                    // First month for this saving group
                    newMonthNo = 1;
                    newYearNo = DateTime.Now.Year;
                    newMonthName = GetMonthName(newMonthNo, newYearNo);
                }
                else
                {
                    // Calculate next month
                    newMonthNo = lastMonth.MonthNo + 1;
                    newYearNo = lastMonth.YearNo;

                    if (newMonthNo > 12)
                    {
                        newMonthNo = 1;
                        newYearNo++;
                    }

                    newMonthName = GetMonthName(newMonthNo, newYearNo);
                }*/
              DateTime date = new DateTime(request.newYearNo, request.newMonthNo, 1); 
              string newMonthName = date.ToString("MMM-yyyy");
               var newMonth = new MonthMaster
                {
                    SGId = request.SGId,
                    PreMonthId = lastMonth?.MonthId ?? 0,
                    MonthName = newMonthName,
                    MonthNo = request.newMonthNo,
                    YearNo = request.newYearNo,
                    Createddate = DateTime.Now
                };
              await _context.MonthMasters.AddAsync(newMonth);
                 await _context.SaveChangesAsync();


                var sgdata=await _context.SavingGroupAccounts.FirstOrDefaultAsync(sg=>sg.SGId==request.SGId);
                var members=await _context.Members.Where(m=>m.SGId==request.SGId && m.IsActive).ToListAsync();

                // Create saving transactions for each member
                List<SavingTrasaction> savingTransactions = new List<SavingTrasaction>();
                foreach (var member in members)
                {
                    var lastTransaction = await _context.SavingTrasactions
                        .Where(st => st.MemberId == member.MemberId && st.MonthId == newMonth.PreMonthId)
                        .FirstOrDefaultAsync();
                    decimal openingBalance = 0;
                    if (lastTransaction != null)
                    {
                        openingBalance = lastTransaction.OutstandingSavingAmount + lastTransaction.CurrentSavingAmount - lastTransaction.DepositSavingAmount;
                    }
                    var newTransaction = new SavingTrasaction
                    {
                        SGId = request.SGId,
                        MonthId = newMonth.MonthId,
                        MemberId = member.MemberId,
                        OutstandingSavingAmount= openingBalance,
                        CurrentSavingAmount=sgdata?.MonthlySavingAmount??0,
                         DepositSavingAmount=0,
                         Createddate = DateTime.Now
                          
                    };
                    savingTransactions.Add(newTransaction);
                }
                if (savingTransactions.Count > 0)
                {
                     _context.SavingTrasactions.AddRange(savingTransactions);
                }
               
                
                // Create interest transactions for each member
                List<IntrestTrasaction> intrestTransactions = new List<IntrestTrasaction>();
                foreach (var member in members)
                {
                    if (member.TotalLoan > 0)
                    {
                        var lastIntrestTransaction = await _context.IntrestTrasactions
                            .Where(it => it.MemberId == member.MemberId && it.MonthId == newMonth.PreMonthId)
                            .FirstOrDefaultAsync();
                        decimal openingIntrestBalance = 0;
                        if (lastIntrestTransaction != null)
                        {
                            openingIntrestBalance = lastIntrestTransaction.OutstandingIntrestAmount + lastIntrestTransaction.CurrentIntrestAmount - lastIntrestTransaction.DepositIntrestAmount;
                        }
                        var newIntrestTransaction = new IntrestTrasaction
                        {
                            SGId = request.SGId,
                            MonthId = newMonth.MonthId,
                            MemberId = member.MemberId,
                            OutstandingIntrestAmount = openingIntrestBalance,
                            CurrentIntrestAmount = member.TotalLoan / 100 * sgdata.MonthlyRateOfIntrest,
                            DepositIntrestAmount = 0,
                            Createddate = DateTime.Now
                        };
                        intrestTransactions.Add(newIntrestTransaction);
                        
                    }
                }
                if(intrestTransactions.Count>0)
                {
                    _context.IntrestTrasactions.AddRange(intrestTransactions);
                }

                List<LoanTrasaction> loanTransactions = new List<LoanTrasaction>();
                foreach (var member in members)
                {
                    if (member.TotalLoan > 0)
                    {
                        var lastLoanTransaction = await _context.LoanTrasactions
                            .Where(lt => lt.MemberId == member.MemberId && lt.MonthId == newMonth.PreMonthId)
                            .FirstOrDefaultAsync();
                        decimal previousLoanAmount = 0;
                        if (lastLoanTransaction != null)
                        {
                            previousLoanAmount = lastLoanTransaction.PreviousLoanAmount + lastLoanTransaction.CurrentLoanAmount - lastLoanTransaction.RepaidLoanAmount;
                        }
                        var newLoanTransaction = new LoanTrasaction
                        {
                            SGId = request.SGId,
                            MonthId = newMonth.MonthId,
                            MemberId = member.MemberId,
                            PreviousLoanAmount = previousLoanAmount,
                            CurrentLoanAmount = 0,
                            RepaidLoanAmount = 0,
                            Createddate = DateTime.Now
                        };
                        loanTransactions.Add(newLoanTransaction);

                    }
                }

                if(loanTransactions.Count > 0)
                {
                    _context.LoanTrasactions.AddRange(loanTransactions);
                }
                await _context.SaveChangesAsync();


                return new CreateMonthResponseDto
                {
                    MonthId = newMonth.MonthId,
                    MonthName = newMonth.MonthName,
                    
                    MonthNo = newMonth.MonthNo,
                    YearNo = newMonth.YearNo,
                    Success = true,
                    Message = "Month created successfully"
                };
            }
                else
                {
                    return new CreateMonthResponseDto
                    {
                        Success = false,
                        Message = "Month already exists for this saving group"
                    };
                }
            }
            catch (Exception ex)
            {
                return new CreateMonthResponseDto
                {
                    Success = false,
                    Message = $"Error creating month: {ex.Message}"
                };
            }
        }

        public async Task<GetLastMonthResponseDto> GetLastMonth(int sgId)
        {
            try
            {
                var lastMonth = await _context.MonthMasters
                    .Where(m => m.SGId == sgId)
                    .OrderByDescending(m => m.YearNo)
                    .ThenByDescending(m => m.MonthNo)
                    .FirstOrDefaultAsync();

                if (lastMonth == null)
                {
                    return new GetLastMonthResponseDto
                    {
                        Success = false,
                        Message = "No month found for this saving group"
                    };
                }

                return new GetLastMonthResponseDto
                {
                    MonthId = lastMonth.MonthId,
                    SGId = lastMonth.SGId,
                    MonthName = lastMonth.MonthName,
                    MonthNo = lastMonth.MonthNo,
                    YearNo = lastMonth.YearNo,
                    CreatedDate = lastMonth.Createddate,
                    Success = true,
                    Message = "Last month retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new GetLastMonthResponseDto
                {
                    Success = false,
                    Message = $"Error retrieving last month: {ex.Message}"
                };
            }
        }

        private string GetMonthName(int monthNo, int yearNo)
        {
            return $"{monthNo:D2}-{yearNo}";
        }
    }
}
