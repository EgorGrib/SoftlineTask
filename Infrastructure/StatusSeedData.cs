using Domain;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class StatusSeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SoftlineTaskDb>();
        if (context.Statuses.Any()) return;
        context.Statuses.AddRange(
            new Status { StatusName = "Создана" },
            new Status { StatusName = "В работе" },
            new Status { StatusName = "Завершена" }
        );
        context.SaveChanges();
    }
}