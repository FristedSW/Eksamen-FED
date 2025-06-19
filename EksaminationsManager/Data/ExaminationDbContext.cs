using Microsoft.EntityFrameworkCore;
using EksaminationsManager.Models;

namespace EksaminationsManager.Data;

public class ExaminationDbContext : DbContext
{
    public ExaminationDbContext(DbContextOptions<ExaminationDbContext> options) : base(options)
    {
    }
    
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<ExaminationResult> ExaminationResults { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure relationships
        modelBuilder.Entity<Student>()
            .HasOne(s => s.Exam)
            .WithMany(e => e.Students)
            .HasForeignKey(s => s.ExamId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<ExaminationResult>()
            .HasOne(er => er.Student)
            .WithOne(s => s.ExaminationResult)
            .HasForeignKey<ExaminationResult>(er => er.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
            
    }
} 