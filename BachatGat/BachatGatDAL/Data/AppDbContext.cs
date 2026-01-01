using Microsoft.EntityFrameworkCore;
using BachatGatDAL.Entities;

namespace BachatGatDAL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<SavingGroupAccount> SavingGroupAccounts { get; set; } = null!;
        public DbSet<MonthMaster> MonthMasters { get; set; } = null!;
        public DbSet<Member> Members { get; set; } = null!;
        public DbSet<BankAccount> BankAccounts { get; set; } = null!;
        public DbSet<CashAccount> CashAccounts { get; set; } = null!;
        public DbSet<SavingTrasaction> SavingTrasactions { get; set; } = null!;
        public DbSet<IntrestTrasaction> IntrestTrasactions { get; set; } = null!;
        public DbSet<LoanTrasaction> LoanTrasactions { get; set; } = null!;
      public DbSet<IncomeExpensesAccount> IncomeExpensesAccounts { get; set; } = null!;
        public DbSet<LoansAccount> LoansAccounts { get; set; } = null!;
        public DbSet<LatePaymentCharges> LatePaymentCharges { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
         
            base.OnModelCreating(modelBuilder);
        }
    }
}
