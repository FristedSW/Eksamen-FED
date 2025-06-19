using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using EksaminationsManager.Models;
using EksaminationsManager.Services;
using System.Collections.ObjectModel;
using System.Globalization;

namespace EksaminationsManager.ViewModels;

[QueryProperty(nameof(ExamId), "ExamId")]
public partial class ExamSessionViewModel : BaseViewModel
{
    private readonly IExaminationService _examinationService;
    private readonly IDispatcher _dispatcher;
    private IDispatcherTimer? _timer;
    private DateTime _examStartTime;
    private DateTime _examinationStartTime;
    private bool _isExaminationStopped = false;
    
    [ObservableProperty]
    private int _examId;
    
    [ObservableProperty]
    private Exam? _currentExam;
    
    [ObservableProperty]
    private ObservableCollection<Student> _students = new();
    
    [ObservableProperty]
    private Student? _currentStudent;
    
    [ObservableProperty]
    private int _currentStudentIndex = 0;
    
    [ObservableProperty]
    private int _currentQuestionNumber = 0;
    
    [ObservableProperty]
    private TimeSpan _remainingTime;
    
    [ObservableProperty]
    private TimeSpan _elapsedTime;
    
    [ObservableProperty]
    private string _notes = string.Empty;
    
    [ObservableProperty]
    private int _selectedGradeIndex = 3;
    
    [ObservableProperty]
    private bool _isExamStarted = false;
    
    [ObservableProperty]
    private bool _isQuestionDrawn = false;
    
    [ObservableProperty]
    private bool _isExaminationStarted = false;
    
    [ObservableProperty]
    private bool _isExaminationEnded = false;
    
    public ExamSessionViewModel(IExaminationService examinationService, IDispatcher dispatcher)
    {
        _examinationService = examinationService;
        _dispatcher = dispatcher;
        Title = "Exam Session";
    }
    
    [RelayCommand]
    private async Task LoadExamAsync()
    {
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            CurrentExam = await _examinationService.GetExamByIdAsync(ExamId);
            if (CurrentExam != null)
            {
                Students = new ObservableCollection<Student>(CurrentExam.Students);
                if (Students.Any())
                {
                    CurrentStudent = Students[0];
                    RemainingTime = TimeSpan.FromMinutes(CurrentExam.ExaminationTimeMinutes);
                }
            }
        }
        catch (Exception ex)
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to load exam: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    [RelayCommand]
    private void StartExam()
    {
        if (Students.Count == 0)
        {
            Shell.Current?.DisplayAlert("Error", "No students found for this exam", "OK");
            return;
        }
        
        // Stop any existing timer
        StopTimer();
        
        IsExamStarted = true;
        _examStartTime = DateTime.Now;
        _timer = _dispatcher.CreateTimer();
        if (_timer != null)
        {
            _timer.Interval = TimeSpan.FromSeconds(1);
            _timer.Tick += Timer_Tick;
            _timer.Start();
        }
        
        CurrentStudent = Students[0];
        CurrentStudentIndex = 0;
    }
    
    [RelayCommand]
    private async Task DrawQuestionAsync()
    {
        if (CurrentExam == null) return;
        
        CurrentQuestionNumber = await _examinationService.GetNextQuestionNumberAsync(ExamId);
        IsQuestionDrawn = true;
    }
    
    [RelayCommand]
    private void StartExamination()
    {
        if (CurrentExam == null) return;
        
        // Stop any existing timer
        StopTimer();
        
        IsExaminationStarted = true;
        _examinationStartTime = DateTime.Now;
        ElapsedTime = TimeSpan.Zero;
        _isExaminationStopped = false;
        _timer = _dispatcher.CreateTimer();
        if (_timer != null)
        {
            _timer.Interval = TimeSpan.FromSeconds(1);
            _timer.Tick += ExaminationTimer_Tick;
            _timer.Start();
        }
    }
    
    [RelayCommand]
    private void EndExamination()
    {
        if (_timer != null && IsExaminationStarted)
        {
            StopTimer();
            _isExaminationStopped = true;
            IsExaminationEnded = true;
        }
    }
    
    private void StopTimer()
    {
        if (_timer != null)
        {
            _timer.Stop();
            _timer.Tick -= Timer_Tick;
            _timer.Tick -= ExaminationTimer_Tick;
            _timer = null;
        }
    }
    
    [RelayCommand]
    private async Task SaveAndMoveOnAsync()
    {
        if (CurrentStudent == null) return;
        
        if (IsBusy) return;
        
        IsBusy = true;
        
        try
        {
            // Convert selected index to grade
            int[] grades = { 0, 2, 4, 7, 10, 12 };
            int grade = grades[SelectedGradeIndex];
            
            // Create summary message
            var summary = $"Student: {CurrentStudent.Name} ({CurrentStudent.StudentId})\n" +
                         $"Question: {CurrentQuestionNumber}\n" +
                         $"Time: {ElapsedTime:mm\\:ss}\n" +
                         $"Grade: {grade}\n" +
                         $"Notes: {(string.IsNullOrWhiteSpace(Notes) ? "None" : Notes)}";
            
            // Show summary popup
            var result = await Shell.Current.DisplayAlert(
                "Summary", 
                summary, 
                "Save & Continue", 
                "Cancel");
            
            if (result)
            {
                var examinationResult = new ExaminationResult
                {
                    StudentId = CurrentStudent.Id,
                    QuestionNumber = CurrentQuestionNumber,
                    ActualExaminationTime = ElapsedTime,
                    Notes = Notes,
                    Grade = grade
                };
                
                await _examinationService.SaveExaminationResultAsync(examinationResult);
                
                // Move to next student
                CurrentStudentIndex++;
                
                if (CurrentStudentIndex < Students.Count)
                {
                    CurrentStudent = Students[CurrentStudentIndex];
                    ResetExaminationState();
                    
                    if (Shell.Current != null)
                    {
                        await Shell.Current.DisplayAlert("Next Student", $"Moving to student #{CurrentStudent.ExamOrder} of {Students.Count}", "OK");
                    }
                }
                else
                {
                    // Exam completed - mark it as finished
                    await MarkExamAsCompleted();
                    
                    if (Shell.Current != null)
                    {
                        await Shell.Current.DisplayAlert("Exam Complete", "All students have been examined!", "OK");
                    }
                    
                    // Navigate back to exams list
                    await Shell.Current.GoToAsync("..");
                }
            }
        }
        catch (Exception ex)
        {
            if (Shell.Current != null)
            {
                await Shell.Current.DisplayAlert("Error", $"Failed to save result: {ex.Message}", "OK");
            }
        }
        finally
        {
            IsBusy = false;
        }
    }
    
    private async Task MarkExamAsCompleted()
    {
        if (CurrentExam != null)
        {
            CurrentExam.IsCompleted = true;
            CurrentExam.CompletedAt = DateTime.Now;
            await _examinationService.UpdateExamAsync(CurrentExam);
        }
    }
    
    private void ResetExaminationState()
    {
        StopTimer();
        IsQuestionDrawn = false;
        IsExaminationStarted = false;
        IsExaminationEnded = false;
        _isExaminationStopped = false;
        CurrentQuestionNumber = 0;
        Notes = string.Empty;
        SelectedGradeIndex = 3;
        ElapsedTime = TimeSpan.Zero;
        RemainingTime = TimeSpan.FromMinutes(CurrentExam?.ExaminationTimeMinutes ?? 30);
    }
    
    private async Task GetRandomQuestionAsync()
    {
        if (CurrentExam == null) return;
        
        CurrentQuestionNumber = await _examinationService.GetNextQuestionNumberAsync(ExamId);
    }
    
    private void Timer_Tick(object? sender, EventArgs e)
    {
        if (IsExamStarted && !IsExaminationStarted)
        {
            _dispatcher.Dispatch(() =>
            {
                var elapsed = DateTime.Now - _examStartTime;
                var totalTime = TimeSpan.FromMinutes(CurrentExam?.ExaminationTimeMinutes ?? 30);
                var remaining = totalTime - elapsed;
                
                if (remaining <= TimeSpan.Zero)
                {
                    RemainingTime = TimeSpan.Zero;
                    StopTimer();
                    _ = SaveAndMoveOnAsync();
                }
                else
                {
                    RemainingTime = remaining;
                }
            });
        }
    }
    
    private void ExaminationTimer_Tick(object? sender, EventArgs e)
    {
        if (IsExaminationStarted && !_isExaminationStopped)
        {
            _dispatcher.Dispatch(() =>
            {
                var totalElapsed = DateTime.Now - _examinationStartTime;
                ElapsedTime = totalElapsed;
                
                var totalTime = TimeSpan.FromMinutes(CurrentExam?.ExaminationTimeMinutes ?? 30);
                var remaining = totalTime - totalElapsed;
                
                if (remaining <= TimeSpan.Zero)
                {
                    RemainingTime = TimeSpan.Zero;
                    ElapsedTime = totalTime;
                    StopTimer();
                    _isExaminationStopped = true;
                    _ = SaveAndMoveOnAsync();
                }
                else
                {
                    RemainingTime = remaining;
                }
            });
        }
    }
    
    [RelayCommand]
    private async Task GoBackAsync()
    {
        StopTimer();
        await Shell.Current.GoToAsync("..");
    }
    
    partial void OnExamIdChanged(int value)
    {
        if (value > 0)
        {
            _ = LoadExamAsync();
        }
    }
} 