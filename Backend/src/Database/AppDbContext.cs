using Microsoft.EntityFrameworkCore;
using FinanceTracker.src.API.Models;
using FinanceTracker.src.Models;

namespace FinanceTracker.src.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }

    public DbSet<Category> Categories { get; set;}
    public DbSet<Transaction> Transactions { get; set;}

}