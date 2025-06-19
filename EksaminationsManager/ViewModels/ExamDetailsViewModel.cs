using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Models;
using EksaminationsManager.Services;

namespace EksaminationsManager.ViewModels;

[QueryProperty(nameof(ExamId), "ExamId")]
public partial class ExamDetailsViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    
    [ObservableProperty]
    private int _examId;
    
    [ObservableProperty]
    private Exam? _exam;
    
    [ObservableProperty]
    private List<ExaminationResult> _results = new();
    
    [ObservableProperty]
    private double _averageGrade;
    
    [ObservableProperty]
    private TimeSpan _averageTime;
    
    public ExamDetailsViewModel(IExaminationService examinationService)
    {
        _examinationService = examinationService;
        Title = "Exam Details";
    }
    
    [RelayCommand]
    private async Task CloseAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
    
    partial void OnExamIdChanged(int value)
    {
        if (value > 0)
        {
            _ = LoadExamDetailsAsync();
        }
    }
    
    private async Task LoadExamDetailsAsync()
    {
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            Exam = await _examinationService.GetExamByIdAsync(ExamId);
            if (Exam != null)
            {
                Results = await _examinationService.GetExaminationResultsForExamAsync(ExamId);
                AverageGrade = await _examinationService.GetAverageGradeForExamAsync(ExamId);
                
                if (Results.Any())
                {
                    var totalTime = Results.Sum(r => r.ActualExaminationTime.TotalSeconds);
                    AverageTime = TimeSpan.FromSeconds(totalTime / Results.Count);
                }
            }
        }
        catch (Exception ex)
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to load exam details: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
} 