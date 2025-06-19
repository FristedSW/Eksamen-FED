using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Models;
using EksaminationsManager.Services;
using System.Collections.ObjectModel;

namespace EksaminationsManager.ViewModels;

public partial class HistoryViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    
    [ObservableProperty]
    private ObservableCollection<Exam> _exams = new();
    
    [ObservableProperty]
    private List<ExaminationResult> _results = new();
    
    [ObservableProperty]
    private Exam? _selectedExam;
    
    [ObservableProperty]
    private double _averageGrade;
    
    public HistoryViewModel(IExaminationService examinationService)
    {
        _examinationService = examinationService;
        Title = "Exam History";
    }
    
    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
    
    [RelayCommand]
    private async Task LoadExamsAsync()
    {
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            var allExams = await _examinationService.GetAllExamsAsync();
            // Only show completed exams
            var completedExams = allExams.Where(e => e.IsCompleted).OrderByDescending(e => e.CompletedAt).ToList();
            
            // Clear and repopulate the ObservableCollection
            Exams.Clear();
            foreach (var exam in completedExams)
            {
                Exams.Add(exam);
            }
            
            System.Diagnostics.Debug.WriteLine($"Loaded {Exams.Count} completed exams");
        }
        catch (Exception ex)
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to load exams: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    [RelayCommand]
    private async Task LoadResultsAsync()
    {
        if (SelectedExam == null) return;
        
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            Results = await _examinationService.GetExaminationResultsForExamAsync(SelectedExam.Id);
            AverageGrade = await _examinationService.GetAverageGradeForExamAsync(SelectedExam.Id);
        }
        catch (Exception ex)
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to load results: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    partial void OnSelectedExamChanged(Exam? value)
    {
        if (value != null)
        {
            _ = LoadResultsAsync();
        }
    }
    
    [RelayCommand]
    private async Task OpenExamDetailsAsync(int examId)
    {
        var parameters = new Dictionary<string, object>
        {
            { "ExamId", examId }
        };
        
        await Shell.Current.GoToAsync("ExamDetailsModal", parameters);
    }
} 