using BachatGatDAL.Interfaces;
using BachatGatDTO.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
namespace BachatGatBGS
{
public class MonthCreateService : BackgroundService
{
    private readonly ILogger<MonthCreateService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public MonthCreateService(ILogger<MonthCreateService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MonthCreateService started at: {time}", DateTimeOffset.Now);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunMonthCreateAsync();

                _logger.LogInformation("MonthCreateService executed at: {time}", DateTimeOffset.Now);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred in MonthCreateService");
            }

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task RunMonthCreateAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var savingGroupRepo = scope.ServiceProvider.GetRequiredService<ISavingGroupRepository>();
        var monthRepo = scope.ServiceProvider.GetRequiredService<IMonthRepository>();

        var savingGroups = await savingGroupRepo.GetAllSavingGroups();
        foreach (var sg in savingGroups)
        {
            if (sg.MonthStartDate == DateTime.Now.Day)
            {
                var monthRequest = new CreateMonthDto 
                {   SGId = sg.SGId ,
                    newMonthNo= DateTime.Now.Month,
                    newYearNo= DateTime.Now.Year
                };
                var data = await monthRepo.CreateMonth(monthRequest);

                _logger.LogInformation($"Processing Saving Group ID: {sg.SGId}, Name: {sg.SGName}");
            }
        }

        _logger.LogInformation("Running MonthCreate job...");
    }
}

}