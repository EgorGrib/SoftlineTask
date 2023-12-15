using Domain;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure;

public class SoftlineTaskDb : DbContext
{
    public DbSet<Problem> Problems { get; set; } = null!;
    public DbSet<Status> Statuses { get; set; } = null!;
    
    public SoftlineTaskDb(DbContextOptions<SoftlineTaskDb> options) : base(options) {}
}