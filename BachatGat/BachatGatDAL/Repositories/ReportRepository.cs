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
    public class ReportRepository:IReportRepository
    {
        private readonly AppDbContext _context;
        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<SavingPendingReportDto>> GetSavingPendingReport(int sgId)
        {
           
           var result=await _context.SavingTrasactions
           .Include(x=>x.Member).Include(x=>x.MonthMaster)
           .Where(x => x.SGId == sgId && (x.CurrentSavingAmount-x.DepositSavingAmount)>0)
           .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new SavingPendingReportDto
              {
                MemberName= g.Key.FullName,
                PendingMonths= string.Join(", ", g.Select(x=>x.MonthMaster.MonthName).ToList()),
                SavingPending= g.Sum(x => x.CurrentSavingAmount - x.DepositSavingAmount)
              }).ToListAsync();            

            return result;
        }

        public async Task<List<LoanPendingReportDto>> GetLoanPendingReport(int sgId)
        {
            var result=await _context.LoansAccounts.Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.LoanAmount-x.RepaymentAmount>0)
            .Select(x=> new LoanPendingReportDto
            {
                MemberName= x.Member.FullName,
                LoanAmount= x.LoanAmount,
                RepaymentAmount= x.RepaymentAmount,
                PendingLoanAmount= x.LoanAmount - x.RepaymentAmount
            }).ToListAsync();
            return result;
        }

        public async Task<List<IntrestPendingReportDto>> GetIntrestPendingReport(int sgId)
        {
            var result= await _context.IntrestTrasactions
            .Include(x=>x.Member).Include(x=>x.MonthMaster)
            .Where(x=>x.SGId==sgId && (x.CurrentIntrestAmount - x.DepositIntrestAmount)>0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new IntrestPendingReportDto
              {
                MemberName= g.Key.FullName,
                PendingMonths= string.Join(", ", g.Select(x=>x.MonthMaster.MonthName).ToList()),
                IntrestPending= g.Sum(x => x.CurrentIntrestAmount - x.DepositIntrestAmount)
              }).ToListAsync();  
            return result;
        }
        public async Task<List<LatePaymetPendingReportDto>> GetLatePaymentPendingReport(int sgId)
        {
            var result= await _context.LatePaymentCharges
            .Include(x=>x.Member).Include(x=>x.MonthMaster)
            .Where(x=>x.SGId==sgId && (x.Charges - x.ChargesDeposit)>0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new LatePaymetPendingReportDto
              {
                MemberName= g.Key.FullName,
                PendingMonths= string.Join(", ", g.Select(x=>x.MonthMaster.MonthName).ToList()),
                LatePaymentPending= g.Sum(x => x.Charges - x.ChargesDeposit)
              }).ToListAsync();  
            return result;
        }
       public async Task<List<MemberReportDto>> GetMemberReport(int sgId)
        {
            var savingData= await _context.SavingTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                MemberName= g.Key.FullName,
                TotalSaving= g.Sum(x => x.CurrentSavingAmount)
              }).ToListAsync();  

            var loanData= await _context.LoansAccounts
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingLoan= g.Sum(x => x.LoanAmount - x.RepaymentAmount)
              }).ToListAsync();  

            var intrestData= await _context.IntrestTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingIntrest= g.Sum(x => x.CurrentIntrestAmount - x.DepositIntrestAmount)
              }).ToListAsync();  

            var latePaymentData= await _context.LatePaymentCharges
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingLatePayment= g.Sum(x => x.Charges - x.ChargesDeposit)
              }).ToListAsync();  

            var result=(from s in savingData
                        join l in loanData on s.MemberId equals l.MemberId into sl
                        from l in sl.DefaultIfEmpty()
                        join i in intrestData on s.MemberId equals i.MemberId into sli
                        from i in sli.DefaultIfEmpty()
                        join lp in latePaymentData on s.MemberId equals lp.MemberId into slip
                        from lp in slip.DefaultIfEmpty()
                        select new MemberReportDto
                        {
                            MemberName= s.MemberName,
                            TotalSaving= s.TotalSaving,
                            PendingLoan= l != null ? l.PendingLoan : 0,
                            PendingIntrest= i != null ? i.PendingIntrest : 0,
                            PendingLatePayment= lp != null ? lp.PendingLatePayment : 0
                        }).ToList();
            return result;
        }


        public async Task<List<MonthDepositReportDto>> GetMonthDepositReport(int sgId, int monthId)
        {
            var savingdeposit= await _context.SavingTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.MonthId==monthId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                MemberName= g.Key.FullName,
                TotalSaving= g.Sum(x => x.DepositSavingAmount)
              }).ToListAsync();  

            var loandeposit= await _context.LoanTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.MonthId==monthId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingLoan= g.Sum(x => x.RepaidLoanAmount)
              }).ToListAsync();  

            var intrestData= await _context.IntrestTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId&& x.MonthId==monthId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingIntrest= g.Sum(x => x.DepositIntrestAmount)
              }).ToListAsync();  

            var latePaymentData= await _context.LatePaymentCharges
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.MonthId==monthId)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingLatePayment= g.Sum(x =>  x.ChargesDeposit)
              }).ToListAsync();  

             var result=(from s in savingdeposit
                        join l in loandeposit on s.MemberId equals l.MemberId into sl
                        from l in sl.DefaultIfEmpty()
                        join i in intrestData on s.MemberId equals i.MemberId into sli
                        from i in sli.DefaultIfEmpty()
                        join lp in latePaymentData on s.MemberId equals lp.MemberId into slip
                        from lp in slip.DefaultIfEmpty()
                        select new MonthDepositReportDto
                        {
                            MemberName= s.MemberName,
                            SavingDeposit= s.TotalSaving,
                            LoanDeposit= l != null ? l.PendingLoan : 0,
                            IntrestDeposit= i != null ? i.PendingIntrest : 0,
                            LatePaymentDeposit= lp != null ? lp.PendingLatePayment : 0
                        }).ToList();
            // Similar logic can be applied to fetch Loan, Intrest and LatePayment deposits for the month
            // and then merge them into the result list.

            return result;
        }

        public async Task<List<MonthPendingReportDto>> GetMonthPendingReport(int sgId, int monthId)
        {
            var savingPending= await _context.SavingTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.MonthId==monthId && (x.CurrentSavingAmount - x.DepositSavingAmount)>0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                MemberName= g.Key.FullName,
                TotalSaving= g.Sum(x => x.CurrentSavingAmount - x.DepositSavingAmount)
              }).ToListAsync();  

            var loanPendding= await _context.LoansAccounts
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.LoanAmount-x.RepaymentAmount>0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingLoan= g.Sum(x => x.LoanAmount - x.RepaymentAmount)
              }).ToListAsync();  

            var intrestPending= await _context.IntrestTrasactions
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId&& x.MonthId==monthId && (x.CurrentIntrestAmount - x.DepositIntrestAmount)>0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingIntrest= g.Sum(x => x.CurrentIntrestAmount - x.DepositIntrestAmount)
              }).ToListAsync();  

            var latePaymentPendding= await _context.LatePaymentCharges
            .Include(x=>x.Member)
            .Where(x=>x.SGId==sgId && x.MonthId==monthId && (x.Charges - x.ChargesDeposit)>0)
            .GroupBy(x => new { x.MemberId, x.Member.FullName })
              .Select(g=> new 
              {
                MemberId= g.Key.MemberId,
                PendingLatePayment= g.Sum(x =>  x.Charges - x.ChargesDeposit)
              }).ToListAsync();

              var result=(from s in savingPending
                        join l in loanPendding on s.MemberId equals l.MemberId into sl
                        from l in sl.DefaultIfEmpty()
                        join i in intrestPending on s.MemberId equals i.MemberId into sli
                        from i in sli.DefaultIfEmpty()
                        join lp in latePaymentPendding on s.MemberId equals lp.MemberId into slip
                        from lp in slip.DefaultIfEmpty()
                        select new MonthPendingReportDto
                        {
                            MemberName= s.MemberName,
                            SavingPending= s.TotalSaving,
                            LoanPending= l != null ? l.PendingLoan : 0,
                            IntrestPending= i != null ? i.PendingIntrest : 0,
                            LatePaymentPending= lp != null ? lp.PendingLatePayment : 0
                        }).ToList();
            return result;
        }

        public async Task<List<MonthDto>> GetMonths(int SgId)
        {
           var result= await _context.MonthMasters.Where(x=>x.SGId==SgId)
           .Select(x=> new MonthDto
           {
            MonthId= x.MonthId,
            MonthName= x.MonthName
           }).ToListAsync();
              return result;
        }

        public async Task<List<MemberDataDto>> GetMembers(int SgId)
        {
           var result= await _context.Members.Where(x=>x.SGId==SgId)
           .Select(x=> new MemberDataDto
           {
            MemberId= x.MemberId,
            MemberName= x.FullName
           }).ToListAsync();
              return result;
        }

    }
}
