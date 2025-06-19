using EksaminationsManager.Models;

namespace EksaminationsManager.Services;

public interface IExaminationService
{
    Task<List<Exam>> GetAllExamsAsync();
    Task<Exam?> GetExamByIdAsync(int id);
    Task<Exam> CreateExamAsync(Exam exam);
    Task<Exam> UpdateExamAsync(Exam exam);
    Task<Student> AddStudentToExamAsync(int examId, Student student);
    Task<List<Student>> GetStudentsForExamAsync(int examId);
    Task<ExaminationResult> SaveExaminationResultAsync(ExaminationResult result);
    Task<List<ExaminationResult>> GetExaminationResultsForExamAsync(int examId);
    Task<double> GetAverageGradeForExamAsync(int examId);
    Task<int> GetNextQuestionNumberAsync(int examId);
} 