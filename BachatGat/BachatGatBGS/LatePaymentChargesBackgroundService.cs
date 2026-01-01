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
    public class LatePaymentChargesBackgroundService : BackgroundService
    {
        private readonly ILogger<LatePaymentChargesBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public LatePaymentChargesBackgroundService(ILogger<LatePaymentChargesBackgroundService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("PaymentChargesService started at: {time}", DateTimeOffset.Now);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunPaymentChargesCalculationAsync();

                    _logger.LogInformation("PaymentChargesService executed at: {time}", DateTimeOffset.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred in PaymentChargesService");
                }

                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task RunPaymentChargesCalculationAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var savingGroupRepo = scope.ServiceProvider.GetRequiredService<ISavingGroupRepository>();
            var paymentChargesRepo = scope.ServiceProvider.GetRequiredService<ILatePaymentChargesRepository>();
            var savingGroups = await savingGroupRepo.GetAllSavingGroups();
            foreach (var sg in savingGroups)
            {   if (sg.MonthEndDate != null && sg.LatePaymentCharges_PerDay != null && sg.MonthEndDate>sg.MonthStartDate
                    && sg.MonthEndDate < DateTime.Now.Day && sg.LatePaymentCharges_PerDay > 0)
                {
                  var data = await paymentChargesRepo.AutoCalculateLatePaymentCharges(sg.SGId);
                _logger.LogInformation($"Processed Late Payment Charges for Saving Group ID: {sg.SGId}, Name: {sg.SGName}");
                }
            }
        }
    }
}