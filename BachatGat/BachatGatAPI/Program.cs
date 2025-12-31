using BachatGatDAL.Interfaces;
using BachatGatDAL.Repositories;
using BachatGatBAL.Services;
using BachatGatBAL.Interfaces;
using BachatGatDAL.Data;
//using BachatGatBGS.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using System.Diagnostics;
using System.Linq;
using BachatGatBGS;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
               
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});
// Member repository/service removed per request

// Register Member services
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IMemberService, MemberService>();

// Register SavingGroup services
builder.Services.AddScoped<ISavingGroupRepository, SavingGroupRepository>();
builder.Services.AddScoped<ISavingGroupService, SavingGroupService>();

// Register Month services
builder.Services.AddScoped<IMonthRepository, MonthRepository>();
builder.Services.AddScoped<IMonthService, MonthService>();
// Register IntrestTrasaction services
builder.Services.AddScoped<IIntrestTrasactionSerivce, IntrestTrasactionSerivce>();
builder.Services.AddScoped<IIntrestTrasactionRepository, IntrestTrasactionRepository>();
// Register SavingTrasaction services   
builder.Services.AddScoped<ISavingTrasactionService, SavingTrasactionService>();
builder.Services.AddScoped<ISavingTrasactionRepository, SavingTrasactionRepository>();
// Register LoansAccount services
builder.Services.AddScoped<ILoansAccountService, LoansAccountService>();
builder.Services.AddScoped<ILoansAccountRepository, LoansAccountRepository>();
// Register LoanTrasaction services
builder.Services.AddScoped<ILoanTrasactionService, LoanTrasactionService>();
builder.Services.AddScoped<ILoanTrasactionRepository, LoanTrasactionRepository>();
// Register Bank services
builder.Services.AddScoped<IBankService, BankService>();
builder.Services.AddScoped<IBankRepository, BankRepository>();
builder.Services.AddHostedService<MonthCreateService>();
// Register AppDbContext using connection string from configuration

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger UI so the API's documentation is reachable when running locally
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
