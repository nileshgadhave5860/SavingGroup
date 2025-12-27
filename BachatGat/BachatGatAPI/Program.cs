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
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader();
               
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
builder.Services.AddHostedService<MonthCreateService>();
// Register AppDbContext using connection string from configuration


var app = builder.Build();

// Enable Swagger UI so the API's documentation is reachable when running locally
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

await app.StartAsync();

try
{
    var url = app.Urls.FirstOrDefault();
    if (string.IsNullOrWhiteSpace(url))
    {
        var server = app.Services.GetService<IServer>();
        var addressesFeature = server?.Features.Get<IServerAddressesFeature>();
        url = addressesFeature?.Addresses.FirstOrDefault();
    }

    if (string.IsNullOrWhiteSpace(url))
    {
        url = builder.Configuration["urls"];
    }

    if (string.IsNullOrWhiteSpace(url))
    {
        url = "http://localhost:5000";
    }

    var swaggerUrl = url.TrimEnd('/') + "/swagger/index.html";
    Process.Start(new ProcessStartInfo { FileName = swaggerUrl, UseShellExecute = true });
}
catch
{
    // ignore any failures to launch browser
}

await app.WaitForShutdownAsync();
