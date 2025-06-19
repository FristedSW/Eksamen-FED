using Microsoft.EntityFrameworkCore;
using EksaminationsManager.Data;
using EksaminationsManager.Models;

namespace EksaminationsManager.Services;

public class ExaminationService : IExaminationService
{
    private readonly ExaminationDbContext _context;
    
    public ExaminationService(ExaminationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<Exam>> GetAllExamsAsync()
    {
        return await _context.Exams
            .Include(e => e.Students)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }
    
    public async Task<Exam?> GetExamByIdAsync(int id)
    {
        return await _context.Exams
            .Include(e => e.Students.OrderBy(s => s.ExamOrder))
            .ThenInclude(s => s.ExaminationResult)
            .FirstOrDefaultAsync(e => e.Id == id);
    }
    
    public async Task<Exam> CreateExamAsync(Exam exam)
    {
        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();
        return exam;
    }
    
    public async Task<Exam> UpdateExamAsync(Exam exam)
    {
        _context.Exams.Update(exam);
        await _context.SaveChangesAsync();
        return exam;
    }
    
    public async Task<Student> AddStudentToExamAsync(int examId, Student student)
    {
        try
        {
            System.Diagnostics.Debug.WriteLine($"Adding student {student.Name} to exam {examId}");
            
            // Verify the exam exists
            var exam = await _context.Exams.FindAsync(examId);
            if (exam == null)
            {
                throw new InvalidOperationException($"Exam with ID {examId} not found");
            }
            
            student.ExamId = examId;
            student.ExamOrder = await GetNextStudentOrderAsync(examId);
            
            System.Diagnostics.Debug.WriteLine($"Student will be assigned order {student.ExamOrder}");
            
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            
            System.Diagnostics.Debug.WriteLine($"Student added successfully with ID {student.Id}");
            return student;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error adding student: {ex.Message}");
            System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }
    
    public async Task<List<Student>> GetStudentsForExamAsync(int examId)
    {
        return await _context.Students
            .Where(s => s.ExamId == examId)
            .OrderBy(s => s.ExamOrder)
            .Include(s => s.ExaminationResult)
            .ToListAsync();
    }
    
    public async Task<ExaminationResult> SaveExaminationResultAsync(ExaminationResult result)
    {
        _context.ExaminationResults.Add(result);
        await _context.SaveChangesAsync();
        return result;
    }
    
    public async Task<List<ExaminationResult>> GetExaminationResultsForExamAsync(int examId)
    {
        return await _context.ExaminationResults
            .Include(er => er.Student)
            .Where(er => er.Student.ExamId == examId)
            .OrderBy(er => er.Student.ExamOrder)
            .ToListAsync();
    }
    
    public async Task<double> GetAverageGradeForExamAsync(int examId)
    {
        var results = await _context.ExaminationResults
            .Include(er => er.Student)
            .Where(er => er.Student.ExamId == examId)
            .ToListAsync();
            
        if (!results.Any())
            return 0;
            
        return results.Average(r => r.Grade);
    }
    
    public async Task<int> GetNextQuestionNumberAsync(int examId)
    {
        var exam = await _context.Exams.FindAsync(examId);
        if (exam == null)
            return 1;
            
        var random = new Random();
        return random.Next(1, exam.NumberOfQuestions + 1);
    }
    
    private async Task<int> GetNextStudentOrderAsync(int examId)
    {
        try
        {
            var maxOrder = await _context.Students
                .Where(s => s.ExamId == examId)
                .MaxAsync(s => (int?)s.ExamOrder) ?? 0;
                
            return maxOrder + 1;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error getting next student order: {ex.Message}");
            // Fallback to 1 if there's an error
            return 1;
        }
    }
} 