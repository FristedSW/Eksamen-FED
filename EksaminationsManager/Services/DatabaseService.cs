using Microsoft.EntityFrameworkCore;
using EksaminationsManager.Data;

namespace EksaminationsManager.Services;

public class DatabaseService
{
    private readonly ExaminationDbContext _context;
    
    public DatabaseService(ExaminationDbContext context)
    {
        _context = context;
    }
    
    public async Task InitializeDatabaseAsync()
    {
        try
        {
            System.Diagnostics.Debug.WriteLine("Starting database initialization...");
            
            // Check if database exists and if we need to recreate it due to schema changes
            bool shouldRecreate = false;
            
            if (await _context.Database.CanConnectAsync())
            {
                System.Diagnostics.Debug.WriteLine("Database exists, checking schema...");
                
                try
                {
                    // Try to query the new columns to see if they exist
                    var testQuery = await _context.Exams
                        .Select(e => new { e.Id, e.IsCompleted, e.CompletedAt })
                        .FirstOrDefaultAsync();
                    
                    System.Diagnostics.Debug.WriteLine("Schema is up to date");
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine($"Schema check failed: {ex.Message}");
                    System.Diagnostics.Debug.WriteLine("Schema needs to be updated, will recreate database");
                    shouldRecreate = true;
                }
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("Database does not exist, will create new one");
                shouldRecreate = true;
            }
            
            if (shouldRecreate)
            {
                System.Diagnostics.Debug.WriteLine("Recreating database with new schema...");
                await _context.Database.EnsureDeletedAsync();
            }
            
            // This ensures the SQLite database is created with all tables
            await _context.Database.EnsureCreatedAsync();
            System.Diagnostics.Debug.WriteLine("Database created/updated successfully");
            
            // You can also add some initial data here if needed
            if (!await _context.Exams.AnyAsync())
            {
                System.Diagnostics.Debug.WriteLine("No exams found, database is empty");
                // Add sample data if needed
                // await AddSampleDataAsync();
            }
        }
        catch (Exception ex)
        {
            // Log the error
            System.Diagnostics.Debug.WriteLine($"Database initialization failed: {ex.Message}");
            System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
            throw; // Re-throw to handle it in the calling code
        }
    }
    
    private async Task AddSampleDataAsync()
    {
        // Add sample exam if needed
        var sampleExam = new Models.Exam
        {
            ExamTerm = "Sample Term",
            CourseName = "Sample Course",
            Date = DateTime.Today,
            NumberOfQuestions = 5,
            ExaminationTimeMinutes = 30,
            StartTime = TimeSpan.FromHours(9)
        };
        
        _context.Exams.Add(sampleExam);
        await _context.SaveChangesAsync();
    }
} 