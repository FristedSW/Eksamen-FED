using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Models;
using EksaminationsManager.Services;

namespace EksaminationsManager.ViewModels;

public partial class CreateExamViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    
    [ObservableProperty]
    private string _examTerm = string.Empty;
    
    [ObservableProperty]
    private string _courseName = string.Empty;
    
    [ObservableProperty]
    private DateTime _date = DateTime.Today;
    
    [ObservableProperty]
    private int _numberOfQuestions = 1;
    
    [ObservableProperty]
    private int _examinationTimeMinutes = 30;
    
    [ObservableProperty]
    private TimeSpan _startTime = TimeSpan.FromHours(9);
    
    public CreateExamViewModel(IExaminationService examinationService)
    {
        _examinationService = examinationService;
        Title = "Create Exam";
    }
    
    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Shell.Current.GoToAsync("..");
    }
    
    [RelayCommand]
    private async Task CreateExamAsync()
    {
        if (IsBusy) return;
        
        if (string.IsNullOrWhiteSpace(ExamTerm) || string.IsNullOrWhiteSpace(CourseName))
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", "Please fill in all required fields", "OK");
            }
            return;
        }
        
        IsBusy = true;
        
        try
        {
            var exam = new Exam
            {
                ExamTerm = ExamTerm,
                CourseName = CourseName,
                Date = Date,
                NumberOfQuestions = NumberOfQuestions,
                ExaminationTimeMinutes = ExaminationTimeMinutes,
                StartTime = StartTime
            };
            
            await _examinationService.CreateExamAsync(exam);
            
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Success", "Exam created successfully!", "OK");
            }
            
            // Navigate back to home page
            await Shell.Current.GoToAsync("//MainPage");
        }
        catch (Exception ex)
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to create exam: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
} 