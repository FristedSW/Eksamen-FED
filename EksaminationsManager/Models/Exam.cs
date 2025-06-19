using System.ComponentModel.DataAnnotations;

namespace EksaminationsManager.Models;

public class Exam
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string ExamTerm { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string CourseName { get; set; } = string.Empty;
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    [Range(1, 100)]
    public int NumberOfQuestions { get; set; }
    
    [Required]
    [Range(1, 480)] // Max 8 hours
    public int ExaminationTimeMinutes { get; set; }
    
    [Required]
    public TimeSpan StartTime { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    // New properties for tracking completion
    public bool IsCompleted { get; set; } = false;
    
    public DateTime? CompletedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
} 