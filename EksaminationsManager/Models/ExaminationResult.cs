using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EksaminationsManager.Models;

public class ExaminationResult
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Range(1, 100)]
    public int QuestionNumber { get; set; }
    
    [Required]
    public TimeSpan ActualExaminationTime { get; set; }
    
    [MaxLength(1000)]
    public string? Notes { get; set; }
    
    [Required]
    [Range(0, 12)] // Danish grading system 0-12
    public int Grade { get; set; }
    
    public DateTime CompletedAt { get; set; } = DateTime.Now;
    
    // Foreign key
    public int StudentId { get; set; }
    
    // Navigation property
    [ForeignKey(nameof(StudentId))]
    public virtual Student Student { get; set; } = null!;
} 