using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EksaminationsManager.Models;

public class Student
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string StudentId { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public int ExamOrder { get; set; }
    
    // Foreign key
    public int ExamId { get; set; }
    
    // Navigation property
    [ForeignKey(nameof(ExamId))]
    public virtual Exam Exam { get; set; } = null!;
    
    // Navigation property for examination results
    public virtual ExaminationResult? ExaminationResult { get; set; }
} 